import { Directive } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OnOffCommandAction, OnOffExtendCommandInfo, OnOffGlobalCommandInfo, OnOffParamValue } from '@devices';
import { ZigbeeCommandValues, ZigbeeComponent } from '../zigbee-component.directive';

interface ZigbeeOnOffCommandValues extends ZigbeeCommandValues {
  state: boolean,
}

interface ZigbeeOnOffParameterValues extends Record<OnOffParamValue | string, string | number | boolean | null> {
  security: boolean,
  icon: string
}

@Directive()
export abstract class DeviceOnOffComponent
  extends ZigbeeComponent<
    OnOffExtendCommandInfo, OnOffCommandAction,
    ZigbeeOnOffCommandValues,
    string, string, string,
    OnOffParamValue, ZigbeeOnOffParameterValues> {
  override infoCommandValues: ZigbeeOnOffCommandValues = {
    ...super.infoCommandValues,
    state: false,
  };

  onOffControl = new FormControl<boolean>(false);

  get stateClass() {
    return this.infoCommandValues.state ? 'color-light' : 'color-disabled';
  }

  get iconClass() {
    return this.parameterValues.icon ?? 'fa-bolt';
  }

  override setParameterValues(values: Record<OnOffParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.security = parseInt(values.security ?? '0') === 1;
    this.parameterValues.icon = values.icon ?? 'fa-bolt';
  };

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
    if (this.parameterValues.security) {
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
      this.infoCommandValues['state'] = !this.infoCommandValues['state'];
    })
  }

  override updateInfoCommandValues(values: Record<OnOffGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.state = values.state === 1;

    this.onOffControl.setValue(this.infoCommandValues.state, { emitEvent: false });

    // console.log(`-- [${ this.name }] Updated info command values`, values, this.infoCommandValues);
  }
}
