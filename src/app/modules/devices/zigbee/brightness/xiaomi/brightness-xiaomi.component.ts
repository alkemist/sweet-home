import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceBrightnessComponent } from "../brightness.component";


@Component({
  selector: "app-device-brightness-xiaomi",
  templateUrl: "../brightness.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../brightness.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceBrightnessXiaomiComponent extends DeviceBrightnessComponent {

}
