import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { WorkerMessage, IWorkerResponseMessageEvent, IWorkerRequestMessageData } from "../models/WorkerModels";

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  public imageData$: Subject<any> = new Subject<any>();
  worker!: Worker;
  constructor() {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('../app/open-cv.worker', { type: 'module' });
      this.worker.onmessage = (messageEvent: IWorkerResponseMessageEvent) => {

        const data = messageEvent.data;
        console.log(`response data is ${messageEvent.data}`);
        switch (data.message) {
          case WorkerMessage.LoadCompleted: {
            console.log("OpenCV has been loaded.");
            break;
          }
          case WorkerMessage.ProcessImageResult:
            this.imageData$.next(messageEvent.data.payload);
            break;
        }
      };
      this.postRequest({ message: WorkerMessage.Load });

    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  public processImage(payload: ImageData): void {
    this.postRequest({ message: WorkerMessage.ProcessImage, payload: payload });
  }

  private postRequest(message: IWorkerRequestMessageData) {
    this.worker.postMessage(message);
  }
}
