import { Component } from '@angular/core';
import { ThermostatCommand, ThermostatComponent } from '../thermostat.component';
import { JeedomCommandResultInterface } from '../../../../models/jeedom-command-result.interface';


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
  override commandValues: Record<ThermostatCommand, JeedomCommandResultInterface | null> = {
    thermostat: null,
    room: null
  };

  static override get commandFilters(): Record<ThermostatCommand, Record<string, string>> {
    return {
      ...super.commandFilters,
      room: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
    }
  }

  override ngOnInit() {
    super.ngOnInit();
  }
}
