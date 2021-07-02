import { Observable, Subject } from "rxjs";

export class ProcessingUnit {

    public static processingUnitId: number = 1;

    private totalImages: number = 0;
    private currentlyProcessed: number = 0;
    private id: number;
    private resultImages: Array<ImageData> = new Array<ImageData>();
    private resultSubject: Subject<Array<ImageData>> = new Subject<Array<ImageData>>();

    public get TotalImages(): number {
        return this.totalImages;
    }

    public get Id(): number {
        return this.id;
    }

    public constructor(totalImages: number) {
        this.totalImages = totalImages;
        this.id = ProcessingUnit.processingUnitId++;
    }

    public next(imageData: Array<ImageData>): void {
        this.resultImages = this.resultImages.concat(imageData);
        this.currentlyProcessed++;
        if (this.isFinished()) {
            this.resultSubject.next(this.resultImages);
            this.resultSubject.complete();
        }
    }

    public isFinished(): boolean {
        if (this.currentlyProcessed === this.totalImages) {
            return true;
        }

        return false;
    }

    public asObservable(): Observable<Array<ImageData>> {
        return this.resultSubject.asObservable();
    }

    public error(message?: string): void {
        this.resultSubject.error(message);
    }




}