import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, queue } from 'rxjs';
import { IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType, WorkerRequestType, IRequestInformation, ObservableEchelonCollection, IWorkerResponseMessageData } from "../models";
import { RequiredValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  private id = 1;
  private worker!: Worker;

  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  public get isLoaded$(): Observable<boolean> {
    return this.isLoadedSubject.asObservable();
  }

  private requestObservableCollections = new Map<number, ObservableEchelonCollection>();

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker('../app/open-cv.worker', { type: 'module' });
      this.worker.onmessage = (message: IWorkerResponseMessageEvent) => { this.handleResponseMessage(message.data); }
      this.postRequest({ requestInformation: this.createRequestInformation(WorkerRequestType.Load) });
    }
    else {
      this.isLoadedSubject.error("Web workers are not supported. The application can not run on this browser");
    }
  }
  private handleResponseMessage(data: IWorkerResponseMessageData): void {
    switch (data.responseInformation.responseType) {
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

    const requestInformation = data.responseInformation;
    const requestObservable = this.requestObservableCollections.get(data.responseInformation.requestId);

    if (data.payload)
      requestObservable?.add(data.payload);
    else {
      requestObservable?.error(`Missing payload for request ${requestInformation.requestId}`);
      this.requestObservableCollections.delete(requestInformation.requestId);
    }

    if (requestInformation.requestCompleted) {
      requestObservable?.complete();
      this.requestObservableCollections.delete(requestInformation.requestId);
    }
  }

  private postRequest(message: IWorkerRequestMessageData) {
    this.worker.postMessage(message);
  }

  private createRequestInformation(requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.id++;
    return { requestType: requestTypeParameter, id: requestId };
  }

  public extractEchelons(payload: ImageData): Observable<Array<ImageData>> {
    const requestInformation = this.createRequestInformation(WorkerRequestType.ExtractEchelons);
    const observableEchelonCollection = new ObservableEchelonCollection();

    this.requestObservableCollections.set(+requestInformation.id, observableEchelonCollection);
    this.postRequest({ requestInformation: requestInformation, payload: payload });
    
    return observableEchelonCollection.echelonsObservable;
  }




}
