import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DevicePresenceComponent } from '../presence.component';


@Component({
  selector: "app-device-presence-sonoff",
  templateUrl: "../presence.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../presence.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicePresenceSonoffComponent extends DevicePresenceComponent {

}
