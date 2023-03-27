import { Directive, Input } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface, SmartArrayModel } from '@models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

export type ThermostatCommandInfo = 'thermostat' | 'room';
export type ThermostatCommandAction = 'thermostat';

@Directive()
export abstract class DeviceThermostatComponent extends BaseDeviceComponent {
  @Input() override actionInfoIds = new SmartArrayModel<ThermostatCommandInfo, number>();
  @Input() override actionCommandIds = new SmartArrayModel<ThermostatCommandAction, number>()

  override infoCommandValues: Record<ThermostatCommandInfo, number | null> = {
    thermostat: null,
    room: null
  };

  thermostatControl = new FormControl<number>(0);
  thermostatStep = 0.5;

  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      room: { generic_type: 'THERMOSTAT_TEMPERATURE' },
      thermostat: {},
    }
  }

  static override get actionCommandFilters(): Record<ThermostatCommandAction, Record<string, string>> {
    return {
      thermostat: { generic_type: 'THERMOSTAT_SET_SETPOINT' },
    }
  }

  override closeModal() {
    super.closeModal();

    if (this.thermostatControl.value) {
      this.setThermostat(this.thermostatControl.value);
    }
  }

  override ngOnInit() {
    super.ngOnInit();

    this.sub = this.thermostatControl.valueChanges
      .pipe(
        debounceTime(2000),
      )
      .subscribe((thermostatValue) => {
        if (thermostatValue) {

        }
      });
  }

  setThermostat(value: number) {
    // console.log(`-- [${this.name}] Set thermostat`, value);
    this.execUpdate('thermostat', { slider: value }).then(_ => {
      this.infoCommandValues['thermostat'] = value;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    if (!this.modalOpened) {
      this.thermostatControl.setValue(this.infoCommandValues.thermostat, { emitEvent: false });
    }
  }

  private execUpdate(commandAction: ThermostatCommandAction, commandValue: any) {
    return super.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction,
      commandValue
    );
  }
}
