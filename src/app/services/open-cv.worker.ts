/// <reference lib="webworker" />
// tslint:disable-next-line: no-any
declare var cv: any;
import {
  IWorkerRequestMessageEvent, IWorkerResponseMessageData, WorkerRequestType, WorkerResponseType,
  IResponseContent, IResponseInformation, IImage, IWorkerRequestMessageData, IWorkerError
} from "../models";

export interface IModule extends WorkerGlobalScope {
  // tslint:disable-next-line: no-any
  Module: any;
}

addEventListener("message", (messageEvent: IWorkerRequestMessageEvent) => {
  const data = messageEvent.data;
  switch (data.information.requestType) {
    case WorkerRequestType.Load: {
      try {
        handleLoadRequest(data);
      }
      catch (error) {
        handleError(error, data);
      }
      break;
    }
    case WorkerRequestType.ExtractEchelons: {
      try {
        handleExtractEchelonRequest(data);
      }
      catch (error) {
        handleError(error, data);
      }
      break;
    }
    case WorkerRequestType.CombineEchelons: {
      try {
        handleCombineEchelonsRequest(data);
      }
      catch (error) {
        handleError(error, data);
      }
      break;
    }
    default:
      throw new Error(`Request type ${data.information.requestType} not implemented.`);
  }
});

async function handleLoadRequest(data: IWorkerRequestMessageData): Promise<void> {
  console.log("Recieved load request");
  // tslint:disable-next-line: no-string-literal
  (self as unknown as IModule)["Module"] = {
    wasmBinaryFile: "assets/opencv/wasm/4.4/opencv_js.wasm",
    usingWasm: true,
    locateFile: locateFile,
    onRuntimeInitialized: () => {
      // postResponse( {information: { responseType: WorkerResponseType.Error, requestId: data.information.id, message: "dummy error"}  });
      postResponse({ information: { responseType: WorkerResponseType.LoadCompleted, requestId: data.information.id } });
    }
  };
  // script sets global cv variable to a factory function that returns a promise with the cv object
  self.importScripts("./assets/opencv/wasm/4.4/opencv.js");
  cv = await cv();
}

function handleExtractEchelonRequest(data: IWorkerRequestMessageData): void {
  if (!data.content) {
    throw new Error("Image content must not be null or undefined");
  }

  const images = data.content.images;
  const extractedEchelons = new Array<ImageData>();

  for (const image of images) {
    const results = extractEchelons(image);
    results.forEach(result => {
      extractedEchelons.push(result);
    });
  }

  const responseInformation = createResponseInformation(WorkerResponseType.EchelonExtracted, data.information.id);
  const responseContent = createResponseContent(extractedEchelons);

  postResponse({ information: responseInformation, content: responseContent });
}

function handleCombineEchelonsRequest(data: IWorkerRequestMessageData): void {
  if (!data.content) {
    throw new Error("Image content must not be null or undefined");
  }

  const images = data.content.images;
  const result = combineEchelons(images);

  const responseInformation = createResponseInformation(WorkerResponseType.EchelonsCombined, data.information.id);
  const responseContent = createResponseContent(new Array<ImageData>(result));

  postResponse({ information: responseInformation, content: responseContent });
}

function handleError(error: IWorkerError, data: IWorkerRequestMessageData): void {
  const errorMessage = `There was an error processing the request. Message:${error.message}. Line number ${error.lineno} Column number: ${error.colno}`;
  const responseInformation = createResponseInformation(WorkerResponseType.Error, data.information.id, errorMessage);

  postResponse({ information: responseInformation });
}

function combineEchelons(images: Array<IImage>): ImageData {
  let rows = images.reduce<number>((height, image2) => height + image2.height, 0);
  const columns = images.reduce<number>((cols, image2) => {
    if (cols > image2.width) {
      return cols;
    }
    else {
      return image2.width;
    }
  }, 0);
  let type = cv.CV_8UC4;

  // hconcat didn't work so we do it manually
  const resultMat = cv.Mat.ones(rows, columns, type);

  let startRow = 0;
  let endRow = images[0].height;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
    const imageMat = cv.matFromImageData(imageData);
    rows += imageMat.rows;
    type = imageMat.type();
    imageMat.copyTo(resultMat.rowRange(startRow, endRow).colRange(0, imageMat.cols));
    if (i !== images.length - 1) {
      startRow = endRow;
      endRow += images[i + 1].height;
    }
    imageMat.delete();
  }

  const result = imageDataFromMat(resultMat);

  resultMat.delete();

  return result;
}

function extractEchelons(image: IImage): Array<ImageData> {


  const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
  const initialMat = cv.matFromImageData(imageData);
  const processedMat = cv.matFromImageData(imageData);
  // let destinationMat = cv.Mat.zeros(processedMat.rows, processedMat.cols, cv.CV_8UC3);

  // grayscale
  cv.cvtColor(processedMat, processedMat, cv.COLOR_RGBA2GRAY, 0);
  // threshold numbers were determined experimentally
  cv.threshold(processedMat, processedMat, 50, 250, cv.THRESH_BINARY);

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(processedMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  const imageDataResults = new Array<ImageData>();

  for (let i = 0; i < contours.size(); i++) {
    const contour = contours.get(i);
    // let approximation = new cv.Mat();
    // let perimeter = cv.arcLength(contour, true);
    // cv.approxPolyDP(contour, approximation, 0.04 * perimeter, true);

    const rectangle = cv.boundingRect(contour);
    const aspectRatio = rectangle.width / rectangle.height;
    if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rectangle.width > 100) {
      console.log(`${i} : Width:${rectangle.width} Height:${rectangle.height}`);
      // const contoursColor = new cv.Scalar(255, 255, 255);
      // const rectangleColor = new cv.Scalar(255, 0, 0);
      // cv.drawContours(destinationMat, contours, 0, contoursColor, 1, 8, hierarchy, 100);
      // let point1 = new cv.Point(rectangle.x, rectangle.y);
      // let point2 = new cv.Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height);
      // cv.rectangle(destinationMat, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
      const resultMat = initialMat.roi(rectangle);
      const echelonImageData = imageDataFromMat(resultMat);
      imageDataResults.push(echelonImageData);
      resultMat.delete();
    }
    // approximation.delete();
    contour.delete();
  }

  hierarchy.delete();
  contours.delete();
  processedMat.delete();
  initialMat.delete();

  return imageDataResults;
}


function createResponseInformation(responseType: WorkerResponseType, requestId: number, message?: string): IResponseInformation {
  return { requestId: requestId, responseType: responseType, message: message };
}

function createResponseContent(imageData: Array<ImageData>): IResponseContent {
  const responseImages = new Array<IImage>();
  imageData.forEach(imgData => {
    responseImages.push({ imageArrayBuffer: imgData.data.buffer, height: imgData.height, width: imgData.width });
  });
  return { images: responseImages };
}

function postResponse(response: IWorkerResponseMessageData): void {
  if (response.content) {
    const arrayBuffers = response.content.images.map(image => image.imageArrayBuffer);
    postMessage(response, arrayBuffers);
  }
  else {
    postMessage(response);
  }
}

function locateFile(path: string, scriptDirectory: string): string {
  if (path === "opencv_js.wasm") {
    return scriptDirectory + "assets/opencv/wasm/4.4/" + path;
  }
  else {
    return scriptDirectory + path;
  }
}

// tslint:disable-next-line: no-any
function imageDataFromMat(mat: any): ImageData {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat();
  const depth = mat.type() % 8;
  const scale = depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0;
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0;
  mat.convertTo(img, cv.CV_8U, scale, shift);

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA);
      break;
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA);
      break;
    case cv.CV_8UC4:
      break;
    default:
      throw new Error(
        "Bad number of channels (Source image must have 1, 3 or 4 channels)"
      );
  }
  const imageData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );
  img.delete();
  return imageData;
}