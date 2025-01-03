import { Directive, signal, WritableSignal } from '@angular/core';
import {
  BrightnessCommandInfo,
  BrightnessExtendCommandInfo,
  BrightnessGlobalCommandInfo,
  BrightnessParamValue
} from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { BrightnessCommandValues, BrightnessParameterValues } from './brightness.interface';
import { MathHelper } from '@alkemist/smart-tools';

@Directive()
export abstract class DeviceBrightnessComponent<
  IE extends BrightnessExtendCommandInfo = BrightnessExtendCommandInfo,
  IV extends BrightnessCommandValues = BrightnessCommandValues,
  I extends string = string,
  P extends BrightnessParamValue = BrightnessParamValue,
  PV extends BrightnessParameterValues = BrightnessParameterValues,
>
  extends ZigbeeBatteryComponent<
    IE,
    never,
    IV,
    I | BrightnessCommandInfo,
    never,
    never,
    P,
    PV
  > {
  size = {
    w: 40,
    h: 40,
  }

  isLight: boolean = false;

  override infoCommandValues: WritableSignal<IV> = signal<IV>({
    ...super.infoCommandSignalValues,
    brightness: 0,
    brightness_lux: 0,
  });

  override ngOnInit() {
    super.ngOnInit();

    this.addDeviceCommandHistory('brightness_lux');
  }

  override setParameterValues(values: Record<BrightnessParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.brightness_lux_light = parseInt(values.brightness_lux_light ?? '');
  };

  override updateInfoCommandValues(values: Record<BrightnessGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.patchInfoCommandValues({
      brightness: MathHelper.round(values.brightness as number, 0),
      brightness_lux: MathHelper.round(values.brightness_lux as number, 0),
    } as Partial<IV>)

    this.isLight = this.infoCommandValues().brightness_lux > this.parameterValues.brightness_lux_light

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues()());
  }
}
