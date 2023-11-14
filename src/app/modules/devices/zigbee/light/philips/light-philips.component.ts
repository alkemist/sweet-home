import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceLightComponent } from '../light.component';


@Component({
  selector: "app-device-light-philips",
  templateUrl: "../light.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../light.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceLightPhilipsComponent extends DeviceLightComponent {
}
