import { Directive, Input } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { SmartArrayModel } from '@models';

export type ThermostatCommandInfo = 'thermostat' | 'room';
export type ThermostatCommandAction = 'thermostat';

@Directive()
export abstract class ThermostatComponent extends BaseDeviceComponent {
  @Input() override actionInfoIds = new SmartArrayModel<ThermostatCommandInfo, number>();
  @Input() override actionCommandIds = new SmartArrayModel<ThermostatCommandAction, number>();
  override infoCommandValues: Record<ThermostatCommandInfo, number | null> = {
    thermostat: null,
    room: null
  };

  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      thermostat: { generic_type: 'THERMOSTAT_TEMPERATURE' },
      room: {},
    }
  }

  static override get actionCommandFilters(): Record<ThermostatCommandAction, Record<string, string>> {
    return {
      thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
    }
  }

  setThermostat(value: number) {
    console.log('-- Set thermostat', value);
    return this.execUpdate(
      this.actionCommandIds.toRecord().thermostat, { slider: value }, "thermostat")
  }
}
