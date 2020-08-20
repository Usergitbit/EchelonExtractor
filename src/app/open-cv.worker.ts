/// <reference lib="webworker" />
declare var cv: any;

import { IWorkerRequestMessageEvent, IWorkerResponseMessageData, WorkerMessage } from "../models/WorkerModels";

export interface IModule extends WorkerGlobalScope {
  Module: any;
}

addEventListener("message", (messageEvent: IWorkerRequestMessageEvent) => {

  console.log(`messageEvent is ${messageEvent}`);
  console.log(`messageEvent.data is ${messageEvent.data}`);
  const data = messageEvent.data;

  switch (data.message) {
    case WorkerMessage.Load: {
      (self as unknown as IModule)["Module"] = {
        scriptUrl: 'assets/opencv/asm/3.4/opencv.js',
        wasmBinaryFile: 'assets/opencv/wasm/3.4/opencv_js.wasm',
        usingWasm: true,
        locateFile: locateFile,
        onRuntimeInitialized: () => {
          postResponse({ message: WorkerMessage.LoadCompleted });
        }
      };
      // Import Webassembly script
      self.importScripts('./assets/opencv/wasm/3.4/opencv.js');
      break;
    }
    case WorkerMessage.ProcessImage: {
      if (!data.payload)
        throw new Error("Image payload must not be null or undefined");
      const result = grayscale(data.payload);
      postResponse({ message: WorkerMessage.ProcessImageResult, payload: result })

      break;
    }
    default: break;
  }
});

function postResponse(message: IWorkerResponseMessageData): void {
  postMessage(message);
}

function locateFile(path: string, scriptDirectory: string): string {
  if (path === 'opencv_js.wasm') {
    return scriptDirectory + "assets/opencv/wasm/3.4/" + path;
  }
  else {
    return scriptDirectory + path;
  }
}

function grayscale(payload: ImageData): ImageData {
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY)
  const imageData = imageDataFromMat(result);
  return imageData;
}

function imageDataFromMat(mat: any): ImageData {
  // converts the mat type to cv.CV_8U
  const img = new cv.Mat()
  const depth = mat.type() % 8
  const scale =
    depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
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
