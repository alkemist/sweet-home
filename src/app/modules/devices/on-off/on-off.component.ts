import { AfterContentInit, AfterViewInit, Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { JeedomCommandResultInterface, SmartArrayModel } from '@models';
import { FormControl } from '@angular/forms';

export type OnOffCommandInfo = 'state';
export type OnOffCommandAction = 'on' | 'off' | 'toggle';

@Directive()
export abstract class OnOffComponent extends BaseDeviceComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  @Input() override actionInfoIds = new SmartArrayModel<OnOffCommandInfo, number>();
  @Input() override actionCommandIds = new SmartArrayModel<OnOffCommandAction, number>();
  onOffControl = new FormControl<boolean>(false);
  override infoCommandValues: Record<OnOffCommandInfo, boolean | null> = {
    state: null
  };

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

    this.execUpdate('toggle').then(_ => {
      this.infoCommandValues['state'] = !this.infoCommandValues['state'];
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    this.onOffControl.setValue(this.infoCommandValues.state, { emitEvent: false });
  }

  private execUpdate(commandAction: OnOffCommandAction) {
    return super.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction
    );
  }
}
