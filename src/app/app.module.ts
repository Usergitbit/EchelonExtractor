import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { EchelonCanvasComponent } from "./components/echelon-canvas/echelon-canvas.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MessageSnackBarComponent } from "./components/message-snack-bar/message-snack-bar.component";
import { MatIconModule } from "@angular/material/icon";
import { DragDropModule } from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    EchelonCanvasComponent,
    MessageSnackBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    FontAwesomeModule,
    DragDropModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
