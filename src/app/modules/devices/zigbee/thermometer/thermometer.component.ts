import { Directive } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { ThermometerExtendCommandInfo, ThermometerGlobalCommandInfo } from '@devices';
import { ZigbeeBatteryComponent } from '../zigbee-battery-component.directive';

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

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
