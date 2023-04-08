import { Directive } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';
import { MathHelper } from '@tools';

@Directive()
export abstract class DeviceThermometerComponent extends ZigbeeBatteryComponent<ThermometerExtendCommandInfo> {
  override infoCommandValues: Record<ThermometerGlobalCommandInfo, number | null> = {
    temperature: null,
    humidity: null,
    pression: null,
    battery: null,
    signal: null,
  };

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.temperature = MathHelper.round(this.infoCommandValues.temperature ?? 0, 1);
    this.infoCommandValues.humidity = MathHelper.round(this.infoCommandValues.humidity ?? 0, 0);
    this.infoCommandValues.pression = MathHelper.round(this.infoCommandValues.pression ?? 0, 0);

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
