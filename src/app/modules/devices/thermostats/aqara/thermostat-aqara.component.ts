import { Component } from '@angular/core';
import { ThermostatCommand, ThermostatComponent } from '../thermostat.component';


@Component({
  selector: 'app-thermostat-aqara',
  templateUrl: './thermostat-aqara.component.html',
  styleUrls: [
    '../../device.component.scss',
    '../thermostat.component.scss',
    './thermostat-aqara.component.scss'
  ],
})
export class ThermostatAqaraComponent extends ThermostatComponent {
  static override get availableCommands(): Record<ThermostatCommand, Record<string, string>> {
    return {
      ...super.availableCommands,
      room: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }
}
