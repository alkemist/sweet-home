import { Component } from '@angular/core';
import { DeviceThermostatComponent, ThermostatCommandInfo } from '../thermostat.component';


@Component({
  selector: 'app-device-thermostat-aqara',
  templateUrl: '../thermostat.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermostat.component.scss',
  ],
})
export class DeviceThermostatAqaraComponent extends DeviceThermostatComponent {
  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      ...super.infoCommandFilters,
      thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne 1' },
    }
  }
}
