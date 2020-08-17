import { Component, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit, ɵclearOverrides, ChangeDetectorRef } from '@angular/core';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { Observable, BehaviorSubject, forkJoin, fromEvent, Subscription } from 'rxjs';
import { tap, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'EchelonExtractor';

  @ViewChild('canvasInput')
  canvasInput!: ElementRef;
  @ViewChild('canvasOutput')
  canvasOutput!: ElementRef;
  @ViewChild('canvasSelected')
  canvasSelected!: ElementRef;
  @ViewChild('canvasProcessed')
  canvasProcessed!: ElementRef;
  @ViewChild('canvasGray')
  canvasGray!: ElementRef;

  @ViewChildren('canvasSelector')
  selectedImagesCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;

  @ViewChildren('echelonCanvasSelector')
  extractedEchelonsCanvasesQueryList!: QueryList<ElementRef<HTMLCanvasElement>>;

  public debug: boolean = false;

  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();

  public files = new Array<string>();
  public extractedEchelons = new Array<string>();


  public image: any;
  public openCVLoadResult!: Observable<OpenCVLoadResult>;

  constructor(private ngOpenCVService: NgOpenCVService, private changeDetector: ChangeDetectorRef) {

  }

  public ngAfterViewInit(): void {
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

  ngOnInit() {
    // Always subscribe to the NgOpenCVService isReady$ observer before using a CV related function to ensure that the OpenCV has been
    // successfully loaded
    this.ngOpenCVService.isReady$
      .pipe(
        // The OpenCV library has been successfully loaded if result.ready === true
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          // Load the face and eye classifiers files
          this.allEchelons = new cv.MatVector();
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        // The classifiers have been succesfully loaded
        this.classifiersLoaded.next(true);
      });
  }



  readDataUrl(eventTarget: EventTarget | null) {

    let fileInput = eventTarget as HTMLInputElement;

    if (fileInput?.files?.length) {
      const reader = new FileReader();
      const load$ = fromEvent(reader, 'load');
      load$
        .pipe(
          switchMap(() => {
            return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvasInput.nativeElement);
          })
        )
        .subscribe(
          () => { },
          err => {
            console.log('Error loading image', err);
          }
        );
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  readTemplateDataUrl(eventTarget: EventTarget | null) {

    // let fileInput = eventTarget as HTMLInputElement;

    // if (fileInput?.files?.length) {
    //   const reader = new FileReader();
    //   const load$ = fromEvent(reader, 'load');
    //   load$
    //     .pipe(
    //       switchMap(() => {
    //         return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvasTemplate.nativeElement);
    //       })
    //     )
    //     .subscribe(
    //       () => { },
    //       err => {
    //         console.log('Error loading image', err);
    //       }
    //     );
    //   reader.readAsDataURL(fileInput.files[0]);
    // }
  }

  private loadImage(eventTarget: EventTarget | null) {

    const fileInput = eventTarget as HTMLInputElement;

    if (fileInput?.files?.length) {
      const reader = new FileReader();
      const load$ = fromEvent(reader, 'load');
      load$
        .pipe(
          switchMap(() => {
            return this.ngOpenCVService.loadImageToHTMLCanvas(`${reader.result}`, this.canvasOutput.nativeElement);
          })
        )
        .subscribe(
          () => { },
          err => {
            console.log('Error loading image', err);
          }
        );
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  // Before attempting face detection, we need to load the appropriate classifiers in memory first
  // by using the createFileFromUrl(path, url) function, which takes two parameters
  // @path: The path you will later use in the detectMultiScale function call
  // @url: The url where to retrieve the file from.
  loadClassifiers(): Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_frontalface_default.xml',
        `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }

  detectFace() {
    // before detecting the face we need to make sure that
    // 1. OpenCV is loaded
    // 2. The classifiers have been loaded
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result: OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.classifiersLoaded$;
        }),
        tap(() => {
          this.clearOutputCanvas();
          this.findFaceAndEyes();
        })
      )
      .subscribe(() => {
        console.log('Face detected');
      });
  }

  clearOutputCanvas() {
    const context = this.canvasOutput.nativeElement.getContext('2d');
    context.clearRect(0, 0, this.canvasOutput.nativeElement.width, this.canvasOutput.nativeElement.height);
  }

  findFaceAndEyes() {
    // Example code from OpenCV.js to perform face and eyes detection
    // Slight adapted for Angular
    const src = cv.imread(this.canvasInput.nativeElement.id);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const faces = new cv.RectVector();
    const eyes = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers, they should be in memory now
    faceCascade.load('haarcascade_frontalface_default.xml');
    eyeCascade.load('haarcascade_eye.xml');
    // detect faces
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
      const roiGray = gray.roi(faces.get(i));
      const roiSrc = src.roi(faces.get(i));
      const point1 = new cv.Point(faces.get(i).x, faces.get(i).y);
      const point2 = new cv.Point(faces.get(i).x + faces.get(i).width, faces.get(i).y + faces.get(i).height);
      cv.rectangle(src, point1, point2, [255, 0, 0, 255]);
      // detect eyes in face ROI
      eyeCascade.detectMultiScale(roiGray, eyes);
      for (let j = 0; j < eyes.size(); ++j) {
        const point3 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
        const point4 = new cv.Point(eyes.get(j).x + eyes.get(j).width, eyes.get(j).y + eyes.get(j).height);
        cv.rectangle(roiSrc, point3, point4, [0, 0, 255, 255]);
      }
      roiGray.delete();
      roiSrc.delete();
    }
    cv.imshow(this.canvasOutput.nativeElement.id, src);
    src.delete();
    gray.delete();
    faceCascade.delete();
    eyeCascade.delete();
    faces.delete();
    eyes.delete();
  }

  public grayScale(): void {
    const sourceImage = cv.imread(this.canvasInput.nativeElement.id);
    const grayScaledImage = new cv.Mat();
    cv.cvtColor(sourceImage, grayScaledImage, cv.COLOR_RGBA2GRAY);
    cv.imshow(this.canvasOutput.nativeElement.id, grayScaledImage);
    sourceImage.delete();
    grayScaledImage.delete();
  }

  private allEchelons: any;
  private subscription!: Subscription;

  public extractAllEchelons(): void {

    this.allEchelons.delete();
    this.allEchelons = new cv.MatVector();
    this.extractedEchelons = [];
    this.changeDetector.detectChanges();

    this.files.forEach(file => {
      let imageEchelons = this.extractImageEchelons(file);
      for (let i = imageEchelons.size() - 1; i >= 0; i--)
        this.allEchelons.push_back(imageEchelons.get(i));
      imageEchelons.delete();
    });

    this.subscription?.unsubscribe();
    this.subscription = this.extractedEchelonsCanvasesQueryList.changes.subscribe((data: QueryList<ElementRef<HTMLCanvasElement>>) => {
      for (let i = 0; i < data.length; i++) {
        this.loadMatToEchelonCanvas(this.allEchelons.get(i), i.toString());
        this.allEchelons.get(i).delete();
      }
    });

    for (let i = 0; i < this.allEchelons.size(); i++) {
      this.extractedEchelons.push(i.toString());
    }
  }

  //should return mat vector with all extracted echelons
  private extractImageEchelons(fileName: string): any {
    let initial = cv.imread(fileName);
    let src = cv.imread(fileName);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);

    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    cv.threshold(src, src, 50, 250, cv.THRESH_BINARY);

    let contours = new cv.MatVector();

    let hierarchy = new cv.Mat();

    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let result = new cv.MatVector();

    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let approx = new cv.Mat();
      let peri = cv.arcLength(cnt, true);
      cv.approxPolyDP(cnt, approx, 0.04 * peri, true);

      let rect = cv.boundingRect(cnt);
      const aspectRatio = rect.width / rect.height;
      if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rect.width > 100) {
        console.log(`${i} : Width:${rect.width} Height:${rect.height}`);
        let contoursColor = new cv.Scalar(255, 255, 255);
        let rectangleColor = new cv.Scalar(255, 0, 0);
        cv.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);

        if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rect.width > 100) {
          let resultMat = initial.roi(rect);
          result.push_back(resultMat);
        }

        cnt.delete();
        approx.delete();
      }
    }

    return result;
  }

  private loadMatToEchelonCanvas(mat: any, canvasId: string): void {
    cv.imshow(canvasId, mat);
  }

  public detectShapes(): void {
    let initial = cv.imread(this.canvasInput.nativeElement.id);
    let src = cv.imread(this.canvasInput.nativeElement.id);
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);

    if (this.debug)
      cv.imshow(this.canvasGray.nativeElement.id, src);

    cv.threshold(src, src, 50, 250, cv.THRESH_BINARY);
    if (this.debug)
      cv.imshow(this.canvasProcessed.nativeElement.id, src);

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

    let copied = new cv.MatVector();
    let cols: Number = 0;
    let rows: Number = 0;

    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let approx = new cv.Mat();
      let peri = cv.arcLength(cnt, true);
      cv.approxPolyDP(cnt, approx, 0.04 * peri, true);

      let rect = cv.boundingRect(cnt);
      const aspectRatio = rect.width / rect.height;
      if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rect.width > 100) {
        console.log(`${i} : Width:${rect.width} Height:${rect.height}`);
        let contoursColor = new cv.Scalar(255, 255, 255);
        let rectangleColor = new cv.Scalar(255, 0, 0);
        cv.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);
        let point1 = new cv.Point(rect.x, rect.y);
        let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
        cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);

        if (aspectRatio >= 6.1 && aspectRatio <= 6.5 && rect.width > 100) {
          let resultMat = initial.roi(rect);
          copied.push_back(resultMat);

          if (resultMat.cols > cols)
            cols = resultMat.cols;
          rows += resultMat.rows;
        }

        cnt.delete();
      }
    }

    if (this.debug)
      cv.imshow(this.canvasOutput.nativeElement.id, dst);


    let result = cv.Mat.ones(rows, cols, copied.get(0).type());

    let start = 0;
    let stop = copied.get(copied.size() - 1).rows;
    for (let i = copied.size() - 1; i >= 0; i--) {
      copied.get(i).copyTo(result.rowRange(start, stop).colRange(0, cols));
      if (i != 0) {
        start = stop;
        stop = stop + copied.get(i - 1).rows;
      }
    }


    cv.imshow(this.canvasSelected.nativeElement.id, result);

    contours.delete(); hierarchy.delete();

    src.delete();
    dst.delete();
    initial.delete();
    for (let i = 0; i < copied.size(); i++) {
      copied.get(i).delete();
    }

  }

  public findNumber(): void {
    // let src = cv.imread(this.canvasInput.nativeElement.id);
    // let templ = cv.imread(this.canvasTemplate.nativeElement.id);
    // let dst = new cv.Mat();
    // let mask = new cv.Mat();
    // cv.matchTemplate(src, templ, dst, cv.TM_SQDIFF_NORMED, mask);
    // let result = cv.minMaxLoc(dst, mask);
    // let maxPoint = result.minLoc;
    // let color = new cv.Scalar(255, 0, 0, 255);
    // let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
    // cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
    // cv.imshow(this.canvasNumber.nativeElement.id, src);
    // src.delete();
    // dst.delete();
    // mask.delete();
  }


}
