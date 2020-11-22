import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, ViewChild } from "@angular/core";
import { fromEvent, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { ImageProcessingService } from "./services/image-processing.service";
import { Echelon } from "./models";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle, faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageSnackBarComponent } from "./components/message-snack-bar/message-snack-bar.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {

  @ViewChildren("canvasSelector")
  private selectedImagesCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChild("resultCanvas")
  private resultCanvasElementRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild("imgFileInput")
  private imgFileInputRef!: ElementRef<HTMLInputElement>;

  public isReady = false;
  public isWorking = false;
  public files = new Array<string>();
  public extractedEchelons = new Array<Echelon>();
  public faGithub = faGithub;
  public faQuestionCircle = faQuestionCircle;
  public faArrowAltCircleDown = faArrowAltCircleDown;
  public resultCanvasHidden = true;
  public extractionDuration = 0;
  public showExtractionDuration = false;

  public constructor(private snackBar: MatSnackBar, private imageProcessingService: ImageProcessingService) {
  }

  public ngAfterViewInit(): void {
    this.imageProcessingService.load().pipe(catchError(error => {
      console.log(error);
      this.snackBar.openFromComponent(MessageSnackBarComponent, { data: `There was an error loading OpenCV: ${error}` });
      return of(false);
    })).subscribe(loadResult => {
      this.isReady = loadResult;
    });
  }

  public onFileSelected(target: EventTarget | null): void {
    this.files = [];
    this.resultCanvasHidden = true;
    this.showExtractionDuration = false;
    this.extractedEchelons = [];
    const value = target as HTMLInputElement;
    if (value == null || value.files == null || value.files.length === 0) {
      return;
    }
    else {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < value.files.length; i++) {
        const file = value.files[i];
        this.files.push(file.name);
        const fileReader: FileReader = new FileReader();

        const load$ = fromEvent<ProgressEvent<FileReader>>(fileReader, "loadend");

        load$.subscribe(result => {
          this.loadImageToCanvas(result, file.name);
        });

        fileReader.readAsDataURL(file);
      }
    }
  }

  private loadImageToCanvas(data: ProgressEvent<FileReader>, fileName: string): void {
    if (data != null && data.target != null) {
      const image = new Image();

      image.onload = (img) => {
        const canvas = this.selectedImagesCanvasesQueryList.find(x => x.nativeElement?.title === fileName)?.nativeElement;
        const context = canvas?.getContext("2d");
        const imageElement = img.target as HTMLImageElement;

        if (canvas) {
          canvas.width = imageElement.naturalWidth;
          canvas.height = imageElement.naturalHeight;
        }
        context?.drawImage(imageElement, 0, 0);
      };

      image.src = data.target.result as string;
    }
  }

  public extractAllEchelons(): void {
    this.showExtractionDuration = false;
    this.isWorking = true;
    const selectedImagesdata = new Array<ImageData>();
    this.selectedImagesCanvasesQueryList.forEach(elementRef => {
      const canvas = elementRef.nativeElement;
      const context = canvas?.getContext("2d");
      const imagedata = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (imagedata) {
        selectedImagesdata.push(imagedata);
      }
    });

    this.clearSelectedFiles();

    const t0 = performance.now();
    this.imageProcessingService.extractEchelons(selectedImagesdata)
      .subscribe(images => {

        this.extractedEchelons = [];
        this.isWorking = false;
        images.forEach(imageData => {
          this.extractedEchelons.push(new Echelon(imageData));
        });

        const t1 = performance.now();
        console.log(`Echelon extraction took ${(t1 - t0)} milliseconds.`);
        this.extractionDuration = (t1 - t0);
        this.showExtractionDuration = true;
      },
        error => {
          console.log(error);
          this.snackBar.openFromComponent(MessageSnackBarComponent, { data: `There was an error extracting echelons: ${error}` });
        });
  }

  public combineSelectedEchelons(): void {
    const selectedEchelons = this.extractedEchelons.filter(echelon => echelon.isSelected);
    const imagesData = selectedEchelons.map(echelon => echelon.imageData);
    this.extractedEchelons = [];
    this.isWorking = true;
    this.showExtractionDuration = false;
    this.imageProcessingService.combineEchelons(imagesData)
      .subscribe(data => {
        this.isWorking = false;
        const canvas = this.resultCanvasElementRef.nativeElement;
        canvas.width = data.width;
        canvas.height = data.height;
        const context = canvas.getContext("2d");
        context?.putImageData(data, 0, 0);
        this.resultCanvasHidden = false;
      },
        error => {
          console.log(error);
          this.snackBar.openFromComponent(MessageSnackBarComponent, { data: `There was an error combining echelons: ${error}` });
        });
  }

  private clearSelectedFiles(): void {
    this.files = [];
    const fileInput = this.imgFileInputRef?.nativeElement;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  public onDownloadClick(): void {
    const image = this.resultCanvasElementRef.nativeElement.toDataURL("image/jpg", 1.0);
    const a = document.createElement("a");
    a.href = image;
    a.download = "echelons.jpg";
    a.click();
  }
}
