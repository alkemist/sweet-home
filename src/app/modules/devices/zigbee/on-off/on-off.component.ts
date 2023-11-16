import { Directive, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OnOffCommandAction, OnOffExtendCommandInfo, OnOffGlobalCommandInfo, OnOffParamValue } from '@devices';
import { ZigbeeComponent } from '../zigbee-component.directive';
import { OnOffParameterValues, ZigbeeOnOffCommandValues } from './on-off.interface';


@Directive()
export abstract class DeviceOnOffComponent<
  IE extends OnOffExtendCommandInfo = OnOffExtendCommandInfo,
  AE extends OnOffCommandAction = OnOffCommandAction,
  IV extends ZigbeeOnOffCommandValues = ZigbeeOnOffCommandValues
>
  extends ZigbeeComponent<
    IE, AE,
    IV,
    string, string, string,
    OnOffParamValue, OnOffParameterValues> {

  override infoCommandValues: WritableSignal<IV> = signal<IV>({
    ...super.infoCommandSignalValues,
    state: false,
  });

  size = {
    w: 50,
    h: 50
  }

  onOffControl = new FormControl<boolean>(false);

  get stateClass() {
    return this.infoCommandValues().state ? 'color-light' : 'color-disabled';
  }

  get iconClass() {
    return this.parameterValues.icon && this.parameterValues.icon !== '' ? this.parameterValues.icon : 'fa-bolt';
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
    if ((this.parameterValues.security || this.isConfigMode) && this.infoCommandValues().state) {
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
      this.updateInfoCommandValue('state', !this.infoCommandValues().state)
    })
  }

  updateInfoCommandValues(values: Record<OnOffGlobalCommandInfo, string | number | boolean | null>) {
    this.updateInfoCommandValue('state', values.state === 1)

    this.onOffControl.setValue(this.infoCommandValues().state, { emitEvent: false });

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }
}
