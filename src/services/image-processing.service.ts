import { Injectable } from '@angular/core';
import {  BehaviorSubject, Observable } from 'rxjs';
import { IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType, WorkerRequestType, IRequestInformation, ObservableEchelonCollection, IWorkerResponseMessageData, IRequestContent } from "../models";

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  private id = 1;

  private worker!: Worker;

  private isLoadedSubject = new BehaviorSubject<boolean>(false);

  private requestObservableCollections = new Map<number, ObservableEchelonCollection>();

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

  public extractEchelons(image: ImageData): Observable<Array<ImageData>> {

    if (!image || !image.data)
      throw new Error("No image data provided!");

    const requestInformation = this.createRequestInformation(WorkerRequestType.ExtractEchelons);
    const requestContent = this.createRequestContent(image);
    const observableEchelonCollection = new ObservableEchelonCollection();

    this.requestObservableCollections.set(+requestInformation.id, observableEchelonCollection);
    this.postRequest({ information: requestInformation, content: requestContent });

    return observableEchelonCollection.echelonsObservable;
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
    const requestObservable = this.requestObservableCollections.get(data.information.requestId);

    if (responseContent) {
      const imageData = new ImageData(new Uint8ClampedArray(responseContent.imageArrayBuffer), responseContent.width, responseContent.height);
      requestObservable?.add(imageData);
    }
    else {
      requestObservable?.error(`Missing payload for request ${responseInformation.requestId}`);
      this.requestObservableCollections.delete(responseInformation.requestId);
    }

    if (responseInformation.requestCompleted) {
      requestObservable?.complete();
      this.requestObservableCollections.delete(responseInformation.requestId);
    }
  }

  private createRequestInformation(requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.id++;
    return { requestType: requestTypeParameter, id: requestId };
  }

  private createRequestContent(image: ImageData): IRequestContent {
    return { height: image.height, width: image.width, imageArrayBuffer: image.data.buffer };
  }

  private postRequest(request: IWorkerRequestMessageData) {

    if (request.content)
      this.worker.postMessage(request, [request.content?.imageArrayBuffer as ArrayBuffer]);
    else
      this.worker.postMessage(request);
  }


}
