import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, queue } from 'rxjs';
import { IWorkerResponseMessageEvent, IWorkerRequestMessageData, WorkerResponseType, WorkerRequestType, IRequestInformation, ObservableEchelonCollection, IWorkerResponseMessageData } from "../models";

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
      this.worker.onmessage = (message: IWorkerResponseMessageEvent) => { this.handleMessage(message.data); }
      this.postRequest({ requestInformation: this.createRequestInformation(WorkerRequestType.Load) });

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
      this.isLoadedSubject.error("Web workers are not supported. The application can not run on this browser");
    }
  }

  public extractEchelons(payload: ImageData): Observable<Array<ImageData>> {
    const requestInformation = this.createRequestInformation(WorkerRequestType.ExtractEchelons);
    const observableEchelonCollection = new ObservableEchelonCollection();
    this.requestObservableCollections.set(+requestInformation.id, observableEchelonCollection);
    this.postRequest({ requestInformation: requestInformation, payload: payload });
    return observableEchelonCollection.echelonsObservable;
  }

  private postRequest(message: IWorkerRequestMessageData) {
    this.worker.postMessage(message);
  }

  private createRequestInformation(requestTypeParameter: WorkerRequestType): IRequestInformation {
    const requestId = this.id++;
    return { requestType: requestTypeParameter, id: requestId };
  }

  private handleMessage(data: IWorkerResponseMessageData): void {
    console.log(`response data is ${data}`);
    switch (data.responseInformation.responseType) {
      case WorkerResponseType.LoadCompleted: {
        console.log("OpenCV has been loaded.");
        this.isLoadedSubject.next(true);
        break;
      }
      case WorkerResponseType.EchelonExtracted:
        const requestInformation = data.responseInformation;
        const requestObservable = this.requestObservableCollections.get(data.responseInformation.requestId);
        if (data.payload)
          requestObservable?.add(data.payload);
        else
          requestObservable?.error(`Missing payload for request ${requestInformation.requestId}`);
        if (requestInformation.requestCompleted)
          requestObservable?.complete();
        break;
    }
  }
}
