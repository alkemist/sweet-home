import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceThermostatComponent} from "../thermostat.component";


@Component({
	selector: "app-device-thermostat-heiman",
	templateUrl: "../thermostat.component.html",
	styleUrls: [
		"../../../base-device.component.scss",
		"../../zigbee.component.scss",
		"../thermostat.component.scss",
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermostatAqaraComponent extends DeviceThermostatComponent {

}
