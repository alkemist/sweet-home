import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceThermometerComponent } from "../thermometer.component";


@Component({
  selector: "app-device-thermometer-sonoff",
  templateUrl: "../thermometer.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../thermometer.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermometerSonoffComponent extends DeviceThermometerComponent {

}
