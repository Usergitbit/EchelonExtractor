import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Echelon } from 'src/app/models';

@Component({
  selector: 'app-echelon-canvas',
  templateUrl: './echelon-canvas.component.html',
  styleUrls: ['./echelon-canvas.component.scss']
})
export class EchelonCanvasComponent implements AfterViewInit {

  @ViewChild("echelonCanvasSelector")
  private canvas!: ElementRef<HTMLCanvasElement>;

  @Input()
  public echelon = new Echelon(new ImageData(1, 1));

  public constructor() { }

  public ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    if (canvas) {
      const context = canvas?.getContext("2d");
      const imageData = this.echelon.imageData;
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context?.putImageData(this.echelon.imageData, 0, 0);
    }
  }

  public onClick() {
    this.echelon.isSelected = !this.echelon.isSelected;
  }

}
