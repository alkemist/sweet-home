import { Component } from '@angular/core';
import { DeviceThermostatComponent, ThermostatCommandInfo } from '../thermostat.component';


@Component({
  selector: 'app-device-thermostat-moes',
  templateUrl: '../thermostat.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermostat.component.scss',
  ],
})
export class DeviceThermostatMoesComponent extends DeviceThermostatComponent {
  override thermostatStep = 1;

  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      ...super.infoCommandFilters,
      thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
    }
  }
}
