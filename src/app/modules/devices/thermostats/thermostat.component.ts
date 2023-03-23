import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../device.component';

export type ThermostatCommand = 'thermostat' | 'room';

@Directive()
export abstract class ThermostatComponent extends BaseDeviceComponent {
  static override get availableCommands(): Record<ThermostatCommand, Record<string, string>> {
    return {
      thermostat: { generic_type: 'THERMOSTAT_TEMPERATURE' },
      room: {},
    }
  }
}
