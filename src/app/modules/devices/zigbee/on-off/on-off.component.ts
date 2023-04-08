import { Directive } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { FormControl } from '@angular/forms';
import { OnOffCommandAction, OnOffExtendCommandInfo, OnOffGlobalCommandInfo, OnOffParamValue } from '@devices';
import { ZigbeeComponent } from '../zigbee-component.directive';

@Directive()
export abstract class DeviceOnOffComponent
  extends ZigbeeComponent<OnOffExtendCommandInfo, OnOffCommandAction, string, string, string, OnOffParamValue> {
  override infoCommandValues: Record<OnOffGlobalCommandInfo, number | null> = {
    state: null,
    signal: null,
  };

  onOffControl = new FormControl<number>(0);

  get hasSecurity() {
    return !!this.parameterValues.security && this.parameterValues.security !== '0';
  }

  get stateClass() {
    return this.infoCommandValues.state ? 'color-light' : 'color-disabled';
  }

  override ngOnInit() {
    super.ngOnInit();


    this.sub = this.onOffControl.valueChanges
      .subscribe((onOff) => {
        if (onOff !== null) {
          this.execToggle();
        }
      })
  }

  toggle() {
    if (this.hasSecurity) {
      this.openModal();
      return;
    }
    if (!this.isUserAction()) {
      return;
    }

    return this.execToggle();
  }

  execToggle() {
    this.execUpdateValue('toggle').then(_ => {
      this.infoCommandValues['state'] = this.infoCommandValues['state'] === 0 ? 1 : 0;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    this.onOffControl.setValue(this.infoCommandValues.state as number, { emitEvent: false });
  }
}
