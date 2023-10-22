import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceOnOffComponent } from "../on-off.component";

@Component({
  selector: "app-device-on-off-schneider",
  templateUrl: "../on-off.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../on-off.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceOnOffSchneiderComponent extends DeviceOnOffComponent {

}
