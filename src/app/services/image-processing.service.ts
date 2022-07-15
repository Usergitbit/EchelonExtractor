import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType,
  WorkerRequestType, IRequestInformation, IWorkerResponseMessageData, IRequestContent, IImage
} from "../models";
import { ProcessingUnit } from "../models/ProcessingUnit";

@Injectable({
  providedIn: "root"
})
export class ImageProcessingService {

  private requestId = 1;

  private workerPool: Array<Worker> = new Array<Worker>();

  private isLoadedSubject = new BehaviorSubject<boolean>(false);

  private processingUnitsMap = new Map<number, ProcessingUnit>();

  private combineRequestMap = new Map<number, Subject<ImageData>>();

  private availableThreads = 4;
  public constructor() {
    // do nothing
  }

  public load(): Observable<boolean> {
    if (typeof Worker !== "undefined") {

      this.availableThreads = navigator.hardwareConcurrency;

      for (let i = 0; i < this.availableThreads; i++) {
        this.workerPool[i] = new Worker(new URL("./open-cv.worker", import.meta.url), { type: "module" });
        this.workerPool[i].onmessage = (message: IWorkerResponseMessageEvent): void => { this.handleResponseMessage(message.data); };
        this.workerPool[i].onerror = (error): void => { this.handleCriticalError(error); };
        const request = this.createRequestInformation(new ProcessingUnit(1), WorkerRequestType.Load);
        console.log("Sending load request.");
        this.postRequest(this.workerPool[i], { information: request });
      }

    }
    else {
      this.isLoadedSubject.error("Web workers are not supported. The application can not run on this browser.");
    }
    return this.isLoadedSubject.asObservable();
  }

  public extractEchelons(images: Array<ImageData>): Observable<Array<ImageData>> {

    if (!images || images.length === 0) {
      throw new Error("No image data provided!");
    }

    const processingUnit = new ProcessingUnit(images.length);
    this.processingUnitsMap.set(processingUnit.Id, processingUnit);

    let i = 0;
    for (const image of images) {
      const requestInformation = this.createRequestInformation(processingUnit, WorkerRequestType.ExtractEchelons);
      const requestContent = this.createRequestContent([image]);
      this.postRequest(this.workerPool[i], { information: requestInformation, content: requestContent });

      if (i < this.availableThreads - 1) {
        i++;
      }
      else {
        // if we have more images than workers then loop through them again
        i = 0;
      }
    }

    return processingUnit.asObservable();
  }

  public combineEchelons(images: Array<ImageData>): Observable<ImageData> {
    if (!images || images.length === 0) {
      throw new Error("No image data provided");
    }

    const requestInformation = this.createRequestInformation(new ProcessingUnit(1), WorkerRequestType.CombineEchelons);
    const requestContent = this.createRequestContent(images);
    const observableEchelon = new Subject<ImageData>();

    this.combineRequestMap.set(requestInformation.requestId, observableEchelon);
    this.postRequest(this.workerPool[0], { information: requestInformation, content: requestContent });

    return observableEchelon.asObservable();
  }

  private handleResponseMessage(data: IWorkerResponseMessageData): void {
    switch (data.information.responseType) {
      case WorkerResponseType.LoadCompleted: {
        //console.log("OpenCV has been loaded.");
        this.isLoadedSubject.next(true);
        break;
      }
      case WorkerResponseType.EchelonExtracted:
        this.handleEchelonExtractedResponse(data);
        break;
      case WorkerResponseType.EchelonsCombined:
        this.handleEchelonCombinedResponse(data);
        break;
      case WorkerResponseType.Error:
        this.handleErrorResponse(data);
        break;
      default:
        throw new Error(`Reponse type ${data.information.responseType} not implemented`);
    }
  }


  private handleEchelonExtractedResponse(data: IWorkerResponseMessageData): void {

    const responseInformation = data.information;
    const responseContent = data.content;
    const processingUnit = this.processingUnitsMap.get(responseInformation.processingUnitId);

    if (responseContent) {
      const responseImages = new Array<ImageData>();
      responseContent.images.forEach(image => {
        const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
        responseImages.push(imageData);
      });
      processingUnit?.next(responseImages);
      if (processingUnit?.isFinished()) {
        this.processingUnitsMap.delete(processingUnit.Id);
      }
    }
    else {
      processingUnit?.error(`No response content for ${processingUnit.Id}`);
    }
  }

  private handleEchelonCombinedResponse(data: IWorkerResponseMessageData): void {

    const responseInformation = data.information;
    const responseContent = data.content;
    const requestSubject = this.combineRequestMap.get(responseInformation.requestId);

    if (responseContent) {
      const image = responseContent.images[0];
      let responseImageData;
      if (image) {
        responseImageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
      }
      else {
        responseImageData = new ImageData(1, 1);
      }

      requestSubject?.next(responseImageData);
      requestSubject?.complete();
      this.combineRequestMap.delete(responseInformation.requestId);
    }

    else {
      requestSubject?.error(`Missing payload for request ${responseInformation.requestId}`);
      this.combineRequestMap.delete(responseInformation.requestId);
    }
  }

  private handleErrorResponse(data: IWorkerResponseMessageData): void {
    const responseInformation = data.information;
    const processingUnit = this.processingUnitsMap.get(responseInformation.processingUnitId);

    if (processingUnit) {
      processingUnit.error(responseInformation.message);
    }
    const combineRequest = this.combineRequestMap.get(responseInformation.requestId);
    if (combineRequest) {
      combineRequest.error(responseInformation.message);
    }

    if (data.information.requestId === 1) {
      this.isLoadedSubject.error(responseInformation.message);
    }
  }

  private handleCriticalError(error: ErrorEvent): void {
    const errorMessage = `An unexpected error has occured: ${error.message} at line ${error.lineno} collumn ${error.colno}`;
    this.combineRequestMap.forEach(request => {
      request.error(errorMessage);
    });
    this.processingUnitsMap.forEach(request => {
      request.error(errorMessage);
    });
  }

  private createRequestInformation(processingUnit: ProcessingUnit, requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.requestId++;
    return { requestType: requestTypeParameter, requestId: requestId, processingUnitId: processingUnit.Id };
  }

  private createRequestContent(images: Array<ImageData>): IRequestContent {

    const contentImages = new Array<IImage>();
    images.forEach(image => {
      contentImages.push({ imageArrayBuffer: image.data.buffer, width: image.width, height: image.height });
    });

    return { images: contentImages };
  }

  private postRequest(worker: Worker, request: IWorkerRequestMessageData): void {
    if (request.content) {
      const arrayBuffers = request.content.images.map(image => image.imageArrayBuffer);
      worker.postMessage(request, arrayBuffers);
    }
    else {
      worker.postMessage(request);
    }
  }
}
