import { AfterContentInit, AfterViewInit, Directive, OnDestroy, OnInit } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { MathHelper } from '@tools';

export type ZigbeeCommandInfo = 'signal';

export interface ZigbeeCommandValues extends Record<ZigbeeCommandInfo | string, string | number | boolean | null> {
  signal: number
}

@Directive()
export abstract class ZigbeeComponent<
  IE extends ZigbeeCommandInfo = ZigbeeCommandInfo, AE extends string = string,
  IV extends ZigbeeCommandValues = ZigbeeCommandValues,
  I extends string = IE, A extends string = AE,
  C extends string = string,
  P extends string = string,
  PV extends Record<P, string | number | boolean | null> = Record<P, string | number | boolean | null>,
> extends BaseDeviceComponent <IE, AE, IV, I, A, C, P, PV>
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  protected override infoCommandValues: IV = {
    ...super.infoCommandValues,
    signal: 0,
  } as IV;

  get signalPercent() {
    return MathHelper.round(this.infoCommandValues.signal * 100 / 255, 0);
  }

  override updateInfoCommandValues(values: Record<ZigbeeCommandInfo, string | number | boolean | null>) {
  }
}
