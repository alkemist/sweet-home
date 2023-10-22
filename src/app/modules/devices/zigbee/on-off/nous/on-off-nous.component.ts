import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DeviceOnOffComponent } from "../on-off.component";
import { OnOffNousExtendCommandAction, OnOffNousExtendCommandInfo } from './on-off-nous.type';
import { ZigbeeOnOffNousCommandValues } from './on-off-nous.interface';


@Component({
  selector: "app-device-on-off-nous",
  templateUrl: "../on-off.component.html",
  styleUrls: [
    "../../../base-device.component.scss",
    "../../zigbee.component.scss",
    "../on-off.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceOnOffNousComponent extends DeviceOnOffComponent<
  OnOffNousExtendCommandInfo, OnOffNousExtendCommandAction, ZigbeeOnOffNousCommandValues
> {
}
