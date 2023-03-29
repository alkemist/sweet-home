import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface } from '@models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

export type ThermostatCommandInfo = 'thermostat' | 'room';
export type ThermostatCommandAction = 'thermostat';

@Directive()
export abstract class DeviceThermostatComponent
  extends BaseDeviceComponent<ThermostatCommandInfo, ThermostatCommandAction> {

  thermostatControl = new FormControl<number>(0);
  thermostatStep = 0.5;
  protected override infoCommandValues: Record<ThermostatCommandInfo, number | null> = {
    thermostat: null,
    room: null
  };

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
    this.execUpdateSlider('thermostat', value).then(_ => {
      this.infoCommandValues['thermostat'] = value;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    if (!this.modalOpened) {
      this.thermostatControl.setValue(this.infoCommandValues.thermostat as number, { emitEvent: false });
    }
  }
}
