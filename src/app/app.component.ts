import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ImageProcessingService } from '../services/image-processing.service';
import { Echelon } from 'src/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChildren('canvasSelector')
  private selectedImagesCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChildren('echelonCanvasSelector')
  private extractedEchelonsCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;

  public isReady = false;
  public isWorking = false;
  public files = new Array<string>();
  public extractedEchelons = new Array<Echelon>();

  constructor(private imageProcessingService: ImageProcessingService) {
  }

  public ngAfterViewInit(): void {
    this.imageProcessingService.load().pipe(catchError(error => {
      console.log(error);
      return of(false);
    })).subscribe(loadResult => {
      this.isReady = loadResult;
    });

    this.extractedEchelonsCanvasesQueryList.changes.subscribe((queryList: QueryList<ElementRef<HTMLCanvasElement>>) => {
      queryList.forEach(elementRef => {
        const canvas = elementRef.nativeElement;
        const context = canvas.getContext("2d");
        const echelon = this.extractedEchelons.find(echelon => echelon.id === +canvas.id);
        if (echelon) {
          canvas.width = echelon.imageData.width;
          canvas.height = echelon.imageData.height;
          context?.putImageData(echelon.imageData, 0, 0);
        }
      });
    });
  }

  public onFileSelected(target: EventTarget | null): void {
    this.files = [];
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

    this.imageProcessingService.extractEchelons(selectedImagesdata)
      .subscribe(images => {
        images.forEach(imageData => {
          this.extractedEchelons.push(new Echelon(imageData));
        });
        this.isWorking = false;
      },
        error => {
          console.log(error);
        });
  }
}
