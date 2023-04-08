import { AfterContentInit, AfterViewInit, Directive, OnDestroy, OnInit } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { MathHelper } from '@tools';

export type ZigbeeCommandInfo = 'signal';

@Directive()
export abstract class ZigbeeComponent<
  IE extends ZigbeeCommandInfo = ZigbeeCommandInfo, AE extends string = string,
  I extends string = string, A extends string = AE,
  C extends string = string, P extends string = string
> extends BaseDeviceComponent <IE, AE, I, A, C, P>
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  protected override infoCommandValues: Record<ZigbeeCommandInfo, string | number | boolean | null> = {
    signal: null,
  };

  get signalPercent() {
    return MathHelper.round((this.infoCommandValues.signal as number) * 100 / 255, 0);
  }
}
