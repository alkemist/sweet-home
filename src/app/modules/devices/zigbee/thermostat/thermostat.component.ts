import { Directive } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ThermostatCommandAction, ThermostatExtendCommandInfo, ThermostatGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';

@Directive()
export abstract class DeviceThermostatComponent
  extends ZigbeeBatteryComponent<ThermostatExtendCommandInfo, ThermostatCommandAction> {

  thermostatControl = new FormControl<number>(0);
  thermostatStep = 0.5;
  protected override infoCommandValues: Record<ThermostatGlobalCommandInfo, number | null> = {
    thermostat: null,
    room: null,
    battery: null,
    signal: null,
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

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
