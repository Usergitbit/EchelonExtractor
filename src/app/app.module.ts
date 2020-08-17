import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgOpenCVModule, OpenCVOptions } from 'ng-open-cv';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CanvasSelectorDirective } from './canvas-selector.directive';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/wasm/3.4/opencv.js`,
  wasmBinaryFile: 'wasm/3.4/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent,
    CanvasSelectorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOpenCVModule.forRoot(openCVConfig),
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
