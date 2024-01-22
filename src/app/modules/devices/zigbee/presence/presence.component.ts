import { Directive, signal, WritableSignal } from '@angular/core';
import {
  PresenceCommandAction,
  PresenceExtendCommandInfo,
  PresenceGlobalCommandInfo,
  PresenceParamValue,
  ZigbeePresenceCommandValues
} from '@devices';
import { ZigbeeComponent } from '../zigbee-component.directive';


@Directive()
export abstract class DevicePresenceComponent<
  IE extends PresenceExtendCommandInfo = PresenceExtendCommandInfo,
  AE extends PresenceCommandAction = PresenceCommandAction,
  IV extends ZigbeePresenceCommandValues = ZigbeePresenceCommandValues
>
  extends ZigbeeComponent<
    IE, AE,
    IV,
    string, string, string,
    PresenceParamValue> {

  override infoCommandValues: WritableSignal<IV> = signal<IV>({
    ...super.infoCommandSignalValues,
    state: false,
  });

  size = {
    w: 50,
    h: 50
  }

  get stateClass() {
    return this.infoCommandValues().state ? 'color-light' : 'color-disabled';
  }

  override setParameterValues(values: Record<PresenceParamValue, string | undefined>) {
    super.setParameterValues(values);
  };

  override ngOnInit() {
    super.ngOnInit();

    this.addDeviceCommandHistory('state');
  }

  updateInfoCommandValues(values: Record<PresenceGlobalCommandInfo, string | number | boolean | null>) {
    this.updateInfoCommandValue('state', values.state === 1)

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }
}
