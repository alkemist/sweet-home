import { Directive, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  ThermostatCommandAction,
  ThermostatCommandInfo,
  ThermostatExtendCommandInfo,
  ThermostatGlobalCommandInfo
} from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { debounceTime } from 'rxjs';
import { ThermostatCommandValues } from './thermostat.interface';
import { MathHelper } from '@alkemist/smart-tools';


@Directive()
export abstract class DeviceThermostatComponent
  extends ZigbeeBatteryComponent<
    ThermostatExtendCommandInfo,
    ThermostatCommandAction,
    ThermostatCommandValues,
    ThermostatCommandInfo
  > {
  size = {
    w: 90,
    h: 54
  }

  thermostatControl = new FormControl<number>(0);
  thermostatStep = 0.5;

  override infoCommandValues: WritableSignal<ThermostatCommandValues> = signal<ThermostatCommandValues>({
    ...super.infoCommandSignalValues,
    thermostat: 0,
    room: 0,
  });

  override openModal() {
    super.openModal();

    document.addEventListener("volumeupbutton", this.upVolumeButton, false);
    document.addEventListener("volumedownbutton", this.downVolumeButton, false);
  }

  override closeModal() {
    super.closeModal();

    if (this.thermostatControl.value) {
      this.setThermostat(this.thermostatControl.value);
    }

    document.removeEventListener("volumeupbutton", this.upVolumeButton, false);
    document.removeEventListener("volumedownbutton", this.downVolumeButton, false);
  }

  override ngOnInit() {
    super.ngOnInit();

    this.sub = this.thermostatControl.valueChanges
      .pipe(
        debounceTime(2000),
      )
      .subscribe((thermostatValue) => {
        if (thermostatValue) {
          this.setThermostat(thermostatValue);
        }
      });
  }

  setThermostat(value: number) {
    // console.log(`-- [${this.name}] Set thermostat`, value);
    this.execUpdateSlider('thermostat', value).then(_ => {
      this.updateInfoCommandValue('thermostat', value)
    })
  }

  override updateInfoCommandValues(values: Record<ThermostatGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.patchInfoCommandValues({
      thermostat: MathHelper.round(values.thermostat as number, 2),
      room: MathHelper.round(values.room as number, 2),
    })

    if (!this.modalOpened) {
      this.thermostatControl.setValue(this.infoCommandValues().thermostat, { emitEvent: false });
    }

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }

  upVolumeButton = () => {
    this.upDownButton(this.thermostatStep);
  }

  downVolumeButton = () => {
    this.upDownButton(-this.thermostatStep);
  }

  private upDownButton(step: number) {
    let thermostatValue = this.thermostatControl.value;
    if (thermostatValue) {
      thermostatValue += step;
      this.thermostatControl.setValue(thermostatValue);
    }
  }
}
