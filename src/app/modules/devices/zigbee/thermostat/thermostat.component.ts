import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ThermostatCommandAction, ThermostatExtendCommandInfo, ThermostatGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryCommandValues, ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { MathHelper } from '@tools';
import { debounceTime } from 'rxjs';

interface ThermostatCommandValues extends ZigbeeBatteryCommandValues {
  thermostat: number,
  room: number,
}

@Directive()
export abstract class DeviceThermostatComponent
  extends ZigbeeBatteryComponent<ThermostatExtendCommandInfo, ThermostatCommandAction, ThermostatCommandValues> {
  size = {
    w: 90,
    h: 54
  }

  thermostatControl = new FormControl<number>(0);
  thermostatStep = 0.5;
  protected override infoCommandValues: ThermostatCommandValues = {
    ...super.infoCommandValues,
    thermostat: 0,
    room: 0,
  };

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
      this.infoCommandValues.thermostat = value;
    })
  }

  override updateInfoCommandValues(values: Record<ThermostatGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.thermostat = MathHelper.round(values.thermostat as number, 2);
    this.infoCommandValues.room = MathHelper.round(values.room as number, 2);

    if (!this.modalOpened) {
      this.thermostatControl.setValue(this.infoCommandValues.thermostat, { emitEvent: false });
    }

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
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
