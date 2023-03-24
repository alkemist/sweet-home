import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';

export type ThermostatCommand = 'thermostat' | 'room';

@Directive()
export abstract class ThermostatComponent extends BaseDeviceComponent {
  static override get commandFilters(): Record<ThermostatCommand, Record<string, string>> {
    return {
      thermostat: { generic_type: 'THERMOSTAT_TEMPERATURE' },
      room: {},
    }
  }
}
