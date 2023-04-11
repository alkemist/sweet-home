import { Directive } from '@angular/core';
import { ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryCommandValues, ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { MathHelper } from '@tools';

interface ThermometerCommandValues extends ZigbeeBatteryCommandValues {
  temperature: number,
  humidity: number,
  pression: number,
}

@Directive()
export abstract class DeviceThermometerComponent
  extends ZigbeeBatteryComponent<ThermometerExtendCommandInfo, string, ThermometerCommandValues> {
  override infoCommandValues: ThermometerCommandValues = {
    ...super.infoCommandValues,
    temperature: 0,
    humidity: 0,
    pression: 0,
  };

  override updateInfoCommandValues(values: Record<ThermometerGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.temperature = MathHelper.round(values.temperature as number, 1);
    this.infoCommandValues.humidity = MathHelper.round(values.humidity as number, 0);
    this.infoCommandValues.pression = MathHelper.round(values.pression as number, 0);

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
