import { Directive, signal, WritableSignal } from '@angular/core';
import { ThermometerCommandInfo, ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { ThermometerCommandValues, ThermometerParameterValues } from './thermometer.interface';
import { MathHelper } from '@alkemist/smart-tools';

@Directive()
export abstract class DeviceThermometerComponent<
  IE extends ThermometerExtendCommandInfo = ThermometerExtendCommandInfo,
  IV extends ThermometerCommandValues = ThermometerCommandValues,
  I extends string = string,
  P extends string = string,
  PV extends ThermometerParameterValues = ThermometerParameterValues,
>
  extends ZigbeeBatteryComponent<
    IE,
    never,
    IV,
    I | ThermometerCommandInfo,
    never,
    never,
    P,
    PV
  > {
  size = {
    w: 120,
    h: 80,
  }

  override infoCommandValues: WritableSignal<IV> = signal<IV>({
    ...super.infoCommandSignalValues,
    temperature: 0,
    humidity: 0,
    pression: 0,
    co2: 0,
  });

  override ngOnInit() {
    super.ngOnInit();

    this.addDeviceCommandHistory('temperature');
  }

  override updateInfoCommandValues(values: Record<ThermometerGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.patchInfoCommandValues({
      temperature: MathHelper.round(values.temperature as number, 1),
      humidity: MathHelper.round(values.humidity as number, 0),
    } as Partial<IV>)

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues()());
  }
}
