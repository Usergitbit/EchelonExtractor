/// <reference lib="webworker" />
declare var cv: any;

import {
  IWorkerRequestMessageEvent, IWorkerResponseMessageData, WorkerRequestType, WorkerResponseType,
  IResponseContent, IResponseInformation, IImage, IWorkerRequestMessageData
} from "../models";

export interface IModule extends WorkerGlobalScope {
  Module: any;
}

addEventListener("message", (messageEvent: IWorkerRequestMessageEvent) => {
  const data = messageEvent.data;

  switch (data.information.requestType) {
    case WorkerRequestType.Load: {
      handleLoadRequest(data);
      break;
    }
    case WorkerRequestType.ExtractEchelons: {
      handleExtractEchelonRequest(data);
      break;
    }
    case WorkerRequestType.CombineEchelons: {
      handleCombineEchelonsRequest(data);
      break;
    }
    default:
      throw new Error(`Request type ${data.information.requestType} not implemented.`);
  }
});

function handleLoadRequest(data: IWorkerRequestMessageData): void {
  console.log("Recieved load request");
  (self as unknown as IModule)["Module"] = {
    scriptUrl: 'assets/opencv/asm/3.4/opencv.js',
    wasmBinaryFile: 'assets/opencv/wasm/3.4/opencv_js.wasm',
    usingWasm: true,
    locateFile: locateFile,
    onRuntimeInitialized: () => {
      postResponse({ information: { responseType: WorkerResponseType.LoadCompleted, requestId: data.information.id } });
    }
  };
  // Import Webassembly script
  self.importScripts('./assets/opencv/wasm/3.4/opencv.js');
}

function handleExtractEchelonRequest(data: IWorkerRequestMessageData): void {
  if (!data.content)
    throw new Error("Image content must not be null or undefined");

  const images = data.content.images;
  let extractedEchelons = new Array<ImageData>();

  for (let i = 0; i < images.length; i++) {
    const results = extractEchelons(images[i]);
    results.forEach(result => {
      extractedEchelons.push(result);
    });
  }

  const responseInformation = createResponseInformation(WorkerResponseType.EchelonExtracted, data.information.id, true);
  const responseContent = createResponseContent(extractedEchelons);

  postResponse({ information: responseInformation, content: responseContent });
}

function handleCombineEchelonsRequest(data: IWorkerRequestMessageData): void {
  if (!data.content)
    throw new Error("Image content must not be null or undefined");

  const images = data.content.images;
  const result = combineEchelons(images);

  const responseInformation = createResponseInformation(WorkerResponseType.EchelonsCombined, data.information.id, true);
  const responseContent = createResponseContent(new Array<ImageData>(result));

  postResponse({ information: responseInformation, content: responseContent });
}

function combineEchelons(images: Array<IImage>): ImageData {
  const imageMats = new cv.MatVector();
  let rows = 0;
  let cols = 0;
  let type = cv.CV_8UC4;
  images.forEach(image => {
    const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
    const imageMat = cv.matFromImageData(imageData);
    rows += imageMat.rows;
    if (imageMat.cols > cols)
      cols = imageMat.cols;
    type = imageMat.type();
    imageMats.push_back(imageMat);
  });

  //hconcat didn't work so we do it manually
  let resultMat = cv.Mat.ones(rows, cols, type);
  let startRow = 0;
  let endRow = imageMats.get(0).rows;
  for(let i = 0; i < imageMats.size(); i++) {
    const imageMat = imageMats.get(i);
    imageMat.copyTo(resultMat.rowRange(startRow, endRow).colRange(0, cols));
    if(i != imageMats.size() - 1) {
      startRow = endRow;
      endRow += imageMats.get(i + 1).rows;
    }
    imageMat.delete();
  }

  imageMats.delete();

  const result = imageDataFromMat(resultMat);

  resultMat.delete();

  return result;
}

function extractEchelons(image: IImage): Array<ImageData> {

  const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
  const initialMat = cv.matFromImageData(imageData);
  let processedMat = cv.matFromImageData(imageData);
  //let destinationMat = cv.Mat.zeros(processedMat.rows, processedMat.cols, cv.CV_8UC3);

  //grayscale
  cv.cvtColor(processedMat, processedMat, cv.COLOR_RGBA2GRAY, 0);
  //threshold numbers were determined experimentally
  cv.threshold(processedMat, processedMat, 50, 250, cv.THRESH_BINARY);

  let contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(processedMat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
  let foundEchelonsMats = new cv.MatVector();

  for (let i = 0; i < contours.size(); i++) {
    let contour = contours.get(i);
    let approximation = new cv.Mat();
    let perimeter = cv.arcLength(contour, true);
    cv.approxPolyDP(contour, approximation, 0.04 * perimeter, true);

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
      foundEchelonsMats.push_back(resultMat);

      contour.delete();
      approximation.delete();
    }
  }

  const imageDataResults = new Array<ImageData>();
  for (let i = foundEchelonsMats.size() - 1; i >= 0; i--) {
    const echelonMat = foundEchelonsMats.get(i);
    const echelonImageData = imageDataFromMat(echelonMat);
    imageDataResults.push(echelonImageData);
    echelonMat.delete();
  }

  foundEchelonsMats.delete();
  initialMat.delete();
  processedMat.delete();
  return imageDataResults;
}


function createResponseInformation(responseType: WorkerResponseType, requestId: number, requestCompleted?: boolean): IResponseInformation {
  return { requestId: requestId, responseType: responseType, requestCompleted: requestCompleted };
}

function createResponseContent(imageData: Array<ImageData>): IResponseContent {
  let responseImages = new Array<IImage>();
  imageData.forEach(imageData => {
    responseImages.push({ imageArrayBuffer: imageData.data.buffer, height: imageData.height, width: imageData.width });
  });
  return { images: responseImages };
}

function postResponse(response: IWorkerResponseMessageData): void {
  if (response.content) {
    const arrayBuffers = response.content.images.map(image => image.imageArrayBuffer);
    postMessage(response, arrayBuffers);
  }
  else
    postMessage(response);
}

function locateFile(path: string, scriptDirectory: string): string {
  if (path === 'opencv_js.wasm') {
    return scriptDirectory + "assets/opencv/wasm/3.4/" + path;
  }
  else {
    return scriptDirectory + path;
  }
}

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
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
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
