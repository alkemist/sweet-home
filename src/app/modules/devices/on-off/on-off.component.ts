import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface } from '@models';
import { FormControl } from '@angular/forms';

export type OnOffCommandInfo = 'state';
export type OnOffCommandAction = 'on' | 'off' | 'toggle';

@Directive()
export abstract class DeviceOnOffComponent extends BaseDeviceComponent<OnOffCommandInfo, OnOffCommandAction, string> {
  override _infoCommandValues: Record<OnOffCommandInfo, number | null> = {
    state: null
  };

  onOffControl = new FormControl<number>(0);

  static override get infoCommandFilters(): Record<OnOffCommandInfo, Record<string, string>> {
    return {
      state: { generic_type: 'LIGHT_STATE' },
    }
  }

  static override get actionCommandFilters(): Record<OnOffCommandAction, Record<string, string>> {
    return {
      on: { generic_type: 'LIGHT_ON' },
      off: { generic_type: 'LIGHT_OFF' },
      toggle: { generic_type: 'LIGHT_TOGGLE' },
    }
  }

  toggle() {
    if (!this.isUserAction()) {
      return;
    }

    // console.log('-- Toggle on-off');

    return this.execUpdate('toggle').then(_ => {
      this.infoCommandValues['state'] = this.infoCommandValues['state'] === 0 ? 1 : 0;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    this.onOffControl.setValue(this.infoCommandValues.state as number, { emitEvent: false });
  }
}
