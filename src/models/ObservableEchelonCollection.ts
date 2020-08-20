import { Subject, Observable, asapScheduler, BehaviorSubject, } from "rxjs";
import { subscribeOn } from "rxjs/operators";

export class ObservableEchelonCollection {
    private echelonListSubject = new BehaviorSubject<Array<ImageData>>([]);
    private echelonImages = new Array<ImageData>();

    public get echelonsObservable(): Observable<Array<ImageData>> {
        return this.echelonListSubject.asObservable();
    }

    public add(imageData: ImageData): void {
        this.echelonImages.push(imageData);
    }
    public complete(): void {
        this.echelonListSubject.next(this.echelonImages);
        this.echelonListSubject.complete();
    }

    public error(message: string): void {
        this.echelonListSubject.error(message);
    }
}