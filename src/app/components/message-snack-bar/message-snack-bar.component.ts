import { Component, Inject } from "@angular/core";
import { MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA } from "@angular/material/legacy-snack-bar";

@Component({
  selector: "app-message-snack-bar",
  templateUrl: "./message-snack-bar.component.html",
  styleUrls: ["./message-snack-bar.component.scss"]
})
export class MessageSnackBarComponent {

  public constructor(@Inject(MAT_SNACK_BAR_DATA) public errorMessage: string) { }

}
