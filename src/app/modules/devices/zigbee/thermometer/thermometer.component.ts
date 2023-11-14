import { Directive, signal, WritableSignal } from '@angular/core';
import {
  ThermometerCommandInfo,
  ThermometerExtendCommandInfo,
  ThermometerGlobalCommandInfo,
  ThermometerParamValue
} from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { MathHelper } from '@tools';
import { ThermometerCommandValues, ThermometerParameterValues } from './thermometer.interface';


@Directive()
export abstract class DeviceThermometerComponent
  extends ZigbeeBatteryComponent<
    ThermometerExtendCommandInfo,
    never,
    ThermometerCommandValues,
    ThermometerCommandInfo,
    never,
    never,
    ThermometerParamValue,
    ThermometerParameterValues
  > {
  size = {
    w: 120,
    h: 80,
  }

  override infoCommandValues: WritableSignal<ThermometerCommandValues> = signal<ThermometerCommandValues>({
    ...super.infoCommandSignalValues,
    temperature: 0,
    humidity: 0,
    pression: 0,
  });

  override setParameterValues(values: Record<ThermometerParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.pression = parseInt(values.pression ?? '0') === 1;
  };

  override async openModal() {
    if (!this.isUserAction()) {
      return;
    }

    const historyPression = await this.execHistory('pression');
    this.modalOpened = true;
  }

  override updateInfoCommandValues(values: Record<ThermometerGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.set({
      ...this.infoCommandValues(),
      temperature: MathHelper.round(values.temperature as number, 1),
      humidity: MathHelper.round(values.humidity as number, 0),
      pression: MathHelper.round(values.pression as number, 0),
    })

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }
}
