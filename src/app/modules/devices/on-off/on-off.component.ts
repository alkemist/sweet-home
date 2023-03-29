import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface } from '@models';
import { FormControl } from '@angular/forms';

export type OnOffCommandInfo = 'state';
export type OnOffCommandAction = 'on' | 'off' | 'toggle';

@Directive()
export abstract class DeviceOnOffComponent extends BaseDeviceComponent<OnOffCommandInfo, OnOffCommandAction> {
  override infoCommandValues: Record<OnOffCommandInfo, number | null> = {
    state: null
  };

  onOffControl = new FormControl<number>(0);

  toggle() {
    if (!this.isUserAction()) {
      return;
    }

    // console.log('-- Toggle on-off');

    return this.execUpdateValue('toggle').then(_ => {
      this.infoCommandValues['state'] = this.infoCommandValues['state'] === 0 ? 1 : 0;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    this.onOffControl.setValue(this.infoCommandValues.state as number, { emitEvent: false });
  }
}
