import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgOpenCVModule, OpenCVOptions } from 'ng-open-cv';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';

const openCVConfig: OpenCVOptions = {
  scriptUrl: `assets/opencv/wasm/3.4/opencv.js`,
  wasmBinaryFile: 'wasm/3.4/opencv_js.wasm',
  usingWasm: true
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOpenCVModule.forRoot(openCVConfig),
    BrowserAnimationsModule,
    MatCardModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatButtonModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
