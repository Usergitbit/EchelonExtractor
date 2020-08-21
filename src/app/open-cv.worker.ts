/// <reference lib="webworker" />
declare var cv: any;

import { IWorkerRequestMessageEvent, IWorkerResponseMessageData, WorkerRequestType, WorkerResponseType, IRequestContent, IResponseContent, IResponseInformation } from "../models";

export interface IModule extends WorkerGlobalScope {
  Module: any;
}

addEventListener("message", (messageEvent: IWorkerRequestMessageEvent) => {

  console.log(`messageEvent is ${messageEvent}`);
  console.log(`messageEvent.data is ${messageEvent.data}`);
  const data = messageEvent.data;

  switch (data.information.requestType) {
    case WorkerRequestType.Load: {
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
      break;
    }
    case WorkerRequestType.ExtractEchelons: {
      if (!data.content)
        throw new Error("Image content must not be null or undefined");

      const result = grayscale(data.content);
      const responseInformation = createResponseInformation(WorkerResponseType.EchelonExtracted, data.information.id, true);
      const responseContent = createResponseContent(result);
      postResponse({ information: responseInformation, content: responseContent });
      break;
    }
    default: break;
  }
});



function createResponseInformation(responseType: WorkerResponseType, requestId: number, requestCompleted?: boolean): IResponseInformation {
  return { requestId: requestId, responseType: responseType, requestCompleted: requestCompleted };
}

function createResponseContent(imageData: ImageData): IResponseContent {
  return { imageArrayBuffer: imageData.data.buffer, height: imageData.height, width: imageData.width };
}

function postResponse(response: IWorkerResponseMessageData): void {
  if (response.content)
    postMessage(response, [response.content?.imageArrayBuffer as ArrayBuffer]);
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

function grayscale(content: IRequestContent): ImageData {
  const requestImageData = new ImageData(new Uint8ClampedArray(content.imageArrayBuffer), content.width, content.height);
  const mat = cv.matFromImageData(requestImageData);
  let result = new cv.Mat();
  cv.cvtColor(mat, result, cv.COLOR_BGR2GRAY)
  const grayscaleImageData = imageDataFromMat(result);
  return grayscaleImageData;
}

function imageDataFromMat(mat: any): ImageData {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat()
  const depth = mat.type() % 8
  const scale = depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
  const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
  mat.convertTo(img, cv.CV_8U, scale, shift)

  // converts the img type to cv.CV_8UC4
  switch (img.type()) {
    case cv.CV_8UC1:
      cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
      break
    case cv.CV_8UC3:
      cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
      break
    case cv.CV_8UC4:
      break
    default:
      throw new Error(
        'Bad number of channels (Source image must have 1, 3 or 4 channels)'
      )
  }
  const imageData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  )
  img.delete()
  return imageData
}
