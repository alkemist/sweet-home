import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface } from '@models';
import { ThermometerCommandInfo } from '@devices';

@Directive()
export abstract class DeviceThermometerComponent extends BaseDeviceComponent<ThermometerCommandInfo> {
  override infoCommandValues: Record<ThermometerCommandInfo, number | null> = {
    temperature: null,
    humidity: null,
    pression: null,
  };

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
  }
}
