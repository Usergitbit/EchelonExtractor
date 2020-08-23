import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ImageProcessingService } from './services/image-processing.service';
import { Echelon } from './models';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChildren('canvasSelector')
  private selectedImagesCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChild('resultCanvas')
  private resultCanvasElementRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imgFileInput')
  private imgFileInputRef!: ElementRef<HTMLInputElement>;

  public isReady = false;
  public isWorking = false;
  public files = new Array<string>();
  public extractedEchelons = new Array<Echelon>();
  public faGithub = faGithub;
  public faQuestionCircle = faQuestionCircle;
  public resultCanvasHidden = true;

  public constructor(private imageProcessingService: ImageProcessingService) {
  }

  public ngAfterViewInit(): void {
    this.imageProcessingService.load().pipe(catchError(error => {
      console.log(error);
      return of(false);
    })).subscribe(loadResult => {
      this.isReady = loadResult;
    });
  }

  public onFileSelected(target: EventTarget | null): void {
    this.files = [];
    this.resultCanvasHidden = true;
    this.extractedEchelons = [];
    let value = target as HTMLInputElement;
    if (value == null || value.files == null || value.files.length == 0)
      return;
    else
      for (let i = 0; i < value.files.length; i++) {
        const file = value.files[i];
        this.files.push(file.name);
        const fileReader: FileReader = new FileReader();

        const load$ = fromEvent<ProgressEvent<FileReader>>(fileReader, 'loadend');

        load$.subscribe(result => {
          this.loadImageToCanvas(result, file.name);
        });

        fileReader.readAsDataURL(file);
      }
  }

  private loadImageToCanvas(data: ProgressEvent<FileReader>, fileName: string): void {
    if (data != null && data.target != null) {
      let img = new Image();

      img.onload = (img) => {
        let canvas = this.selectedImagesCanvasesQueryList.find(x => x.nativeElement?.title === fileName)?.nativeElement;
        let context = canvas?.getContext("2d");
        let image = img.target as HTMLImageElement;

        if (canvas) {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
        }
        context?.drawImage(image, 0, 0);
      }

      img.src = data.target.result as string;
    }
  }

  public extractAllEchelons(): void {
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

    this.imageProcessingService.extractEchelons(selectedImagesdata)
      .subscribe(images => {
        this.isWorking = false;
        images.forEach(imageData => {
          this.extractedEchelons.push(new Echelon(imageData));
        });
      },
        error => {
          console.log(error);
        });
  }

  public combineSelectedEchelons(): void {
    const selectedEchelons = this.extractedEchelons.filter(echelon => echelon.isSelected);
    const imagesData = selectedEchelons.map(echelon => echelon.imageData);
    this.extractedEchelons = [];
    this.isWorking = true;
    this.imageProcessingService.combineEchelons(imagesData)
      .subscribe(data => {
        this.isWorking = false;
        const canvas = this.resultCanvasElementRef.nativeElement;
        canvas.width = data.width;
        canvas.height = data.height;
        const context = canvas.getContext("2d");
        context?.putImageData(data, 0, 0);
        this.resultCanvasHidden = false;
      });
  }
  
  private clearSelectedFiles() {
    this.files = [];
    var fileInput = this.imgFileInputRef?.nativeElement;
    if(fileInput)
      fileInput.value = "";
  }
}
