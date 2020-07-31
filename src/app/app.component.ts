import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'EchelonExtractor';

  public image: any;


  public onFileSelected(value: HTMLInputElement): void {

    let file: File;
    if (value == null || value.files == null || value.files.length == 0)
      return;
    else
      file = value.files[0];

    var fileReader: FileReader = new FileReader();

    fileReader.onloadend = this.loadImage.bind(this);
    fileReader.readAsDataURL(file);
  }

  private loadImage(data: ProgressEvent<FileReader>) :void {
    if (data != null && data.target != null)
      this.image = data.target.result;
  }

}
