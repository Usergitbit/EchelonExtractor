import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType,
  WorkerRequestType, IRequestInformation, IWorkerResponseMessageData, IRequestContent, IImage
} from "../models";

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  private id = 1;

  private worker!: Worker;

  private isLoadedSubject = new BehaviorSubject<boolean>(false);

  private extractRequestMap = new Map<number, Subject<Array<ImageData>>>();
  private combineRequestMap = new Map<number, Subject<ImageData>>();

  constructor() {
  }

  public load(): Observable<boolean> {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('./open-cv.worker', { type: 'module' });
      this.worker.onmessage = (message: IWorkerResponseMessageEvent) => { this.handleResponseMessage(message.data); }
      const request = this.createRequestInformation(WorkerRequestType.Load);
      console.log("Sending load request.");
      this.postRequest({ information: request });
    }
    else {
      this.isLoadedSubject.error("Web workers are not supported. The application can not run on this browser");
      console.log("Web workers not supported");
    }
    return this.isLoadedSubject.asObservable();
  }

  public extractEchelons(images: Array<ImageData>): Observable<Array<ImageData>> {

    if (!images || images.length == 0)
      throw new Error("No image data provided!");

    const requestInformation = this.createRequestInformation(WorkerRequestType.ExtractEchelons);
    const requestContent = this.createRequestContent(images);
    const observableEchelonCollection = new Subject<Array<ImageData>>();

    this.extractRequestMap.set(+requestInformation.id, observableEchelonCollection);
    this.postRequest({ information: requestInformation, content: requestContent });

    return observableEchelonCollection.asObservable();
  }

  public combineEchelons(images: Array<ImageData>): Observable<ImageData> {
    if (!images || images.length == 0)
      throw new Error("No image data provided");

    const requestInformation = this.createRequestInformation(WorkerRequestType.CombineEchelons);
    const requestContent = this.createRequestContent(images);
    const observableEchelon = new Subject<ImageData>();

    this.combineRequestMap.set(requestInformation.id, observableEchelon);
    this.postRequest({ information: requestInformation, content: requestContent });

    return observableEchelon.asObservable();
  }

  private handleResponseMessage(data: IWorkerResponseMessageData): void {
    switch (data.information.responseType) {
      case WorkerResponseType.LoadCompleted: {
        console.log("OpenCV has been loaded.");
        this.isLoadedSubject.next(true);
        break;
      }
      case WorkerResponseType.EchelonExtracted:
        this.handleEchelonExtractedResponse(data);
        break;
      case WorkerResponseType.EchelonsCombined:
        this.handleEchelonCombinedResponse(data);
        break;
      default:
        throw new Error(`Reponse type ${data.information.responseType} not implemented`);
    }
  }

  private handleEchelonExtractedResponse(data: IWorkerResponseMessageData): void {

    const responseInformation = data.information;
    const responseContent = data.content;
    const requestSubject = this.extractRequestMap.get(data.information.requestId);

    if (responseContent) {
      let responseImages = new Array<ImageData>();
      responseContent.images.forEach(image => {
        const imageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
        responseImages.push(imageData);
      });
      requestSubject?.next(responseImages);
    }
    else {
      requestSubject?.error(`Missing payload for request ${responseInformation.requestId}`);
      this.extractRequestMap.delete(responseInformation.requestId);
    }

    if (responseInformation.requestCompleted) {
      requestSubject?.complete();
      this.extractRequestMap.delete(responseInformation.requestId);
    }
  }

  private handleEchelonCombinedResponse(data: IWorkerResponseMessageData): void {

    const responseInformation = data.information;
    const responseContent = data.content;
    const requestSubject = this.combineRequestMap.get(responseInformation.requestId);

    if (responseContent) {
      const image = responseContent.images[0];
      let responseImageData;
      if (image)
        responseImageData = new ImageData(new Uint8ClampedArray(image.imageArrayBuffer), image.width, image.height);
      else
        responseImageData = new ImageData(1, 1);

      requestSubject?.next(responseImageData);
    }

    else {
      requestSubject?.error(`Missing payload for request ${responseInformation.requestId}`);
      this.combineRequestMap.delete(responseInformation.requestId);
    }

    if (responseInformation.requestCompleted) {
      requestSubject?.complete();
      this.extractRequestMap.delete(responseInformation.requestId);
    }

  }

  private createRequestInformation(requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.id++;
    return { requestType: requestTypeParameter, id: requestId };
  }

  private createRequestContent(images: Array<ImageData>): IRequestContent {

    let contentImages = new Array<IImage>();
    images.forEach(image => {
      contentImages.push({ imageArrayBuffer: image.data.buffer, width: image.width, height: image.height });
    });

    return { images: contentImages };
  }

  private postRequest(request: IWorkerRequestMessageData) {
    if (request.content) {
      const arrayBuffers = request.content.images.map(image => image.imageArrayBuffer);
      this.worker.postMessage(request, arrayBuffers);
    }
    else
      this.worker.postMessage(request);
  }


}
