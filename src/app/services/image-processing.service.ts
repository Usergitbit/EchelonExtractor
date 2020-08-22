import { Injectable } from '@angular/core';
import {  BehaviorSubject, Observable, Subject } from 'rxjs';
import { IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType, 
  WorkerRequestType, IRequestInformation, IWorkerResponseMessageData, IRequestContent, IImage } from "../models";

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  private id = 1;

  private worker!: Worker;

  private isLoadedSubject = new BehaviorSubject<boolean>(false);

  private requestSubjectCollections = new Map<number, Subject<Array<ImageData>>>();

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

    this.requestSubjectCollections.set(+requestInformation.id, observableEchelonCollection);
    this.postRequest({ information: requestInformation, content: requestContent });

    return observableEchelonCollection.asObservable();
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
    }
  }

  private handleEchelonExtractedResponse(data: IWorkerResponseMessageData) {

    const responseInformation = data.information;
    const responseContent = data.content;
    const requestSubject = this.requestSubjectCollections.get(data.information.requestId);

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
      this.requestSubjectCollections.delete(responseInformation.requestId);
    }

    if (responseInformation.requestCompleted) {
      requestSubject?.complete();
      this.requestSubjectCollections.delete(responseInformation.requestId);
    }
  }

  private createRequestInformation(requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.id++;
    return { requestType: requestTypeParameter, id: requestId };
  }

  private createRequestContent(images: Array<ImageData>): IRequestContent {

    let contentImages = new Array<IImage>();
    images.forEach(image => {
      contentImages.push({ imageArrayBuffer: image.data.buffer, width:image.width, height: image.height });
    });

    return { images: contentImages };
  }

  private postRequest(request: IWorkerRequestMessageData) {
    if (request.content){
      const arrayBuffers = request.content.images.map(image => image.imageArrayBuffer);
      this.worker.postMessage(request, arrayBuffers);
    }
    else
      this.worker.postMessage(request);
  }


}
