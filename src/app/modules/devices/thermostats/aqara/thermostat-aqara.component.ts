import { Component } from '@angular/core';
import { ThermostatCommandInfo, ThermostatComponent } from '../thermostat.component';


@Component({
  selector: 'app-thermostat-aqara',
  templateUrl: './thermostat-aqara.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermostat.component.scss',
    './thermostat-aqara.component.scss'
  ],
})
export class ThermostatAqaraComponent extends ThermostatComponent {
  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      ...super.infoCommandFilters,
      room: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  updateThermostat() {
    void this.setThermostat(21);
  }
}
