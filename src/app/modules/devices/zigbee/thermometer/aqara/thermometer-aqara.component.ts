import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceThermometerComponent} from "../thermometer.component";


@Component({
	selector: "app-device-thermometer-lidl",
	templateUrl: "../thermometer.component.html",
	styleUrls: [
		"../../../base-device.component.scss",
		"../../zigbee.component.scss",
		"../thermometer.component.scss",
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermometerAqaraComponent extends DeviceThermometerComponent {

}
