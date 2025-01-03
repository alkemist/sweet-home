import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceThermostatComponent} from "../thermostat.component";
import { ThermostatGlobalCommandInfo } from '@devices';
import { MathHelper } from '@alkemist/smart-tools';
import { environment } from '../../../../../../environments/environment';

@Component({
	selector: "app-device-thermostat-tuya",
	templateUrl: "../thermostat.component.html",
	styleUrls: [
		"../../../base-device.component.scss",
		"../../zigbee.component.scss",
		"../thermostat.component.scss",
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceThermostatTuyaComponent extends DeviceThermostatComponent {
	override updateInfoCommandValues(values: Record<ThermostatGlobalCommandInfo, string | number | boolean | null>) {
		super.updateInfoCommandValues(values);

		this.updateInfoCommandValue('battery', environment["APP_OFFLINE"] || !parseInt(values.battery_low?.toString() ?? '0')
			? 100
			: 0
		)
	}
}
