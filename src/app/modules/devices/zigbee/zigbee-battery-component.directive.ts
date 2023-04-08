import { AfterContentInit, AfterViewInit, Directive, OnDestroy, OnInit } from '@angular/core';
import { ZigbeeCommandInfo, ZigbeeComponent } from './zigbee-component.directive';

export type ZigbeeBatteryCommandInfo = 'battery';

export type ZigbeeBatteryExtendCommandInfo = ZigbeeBatteryCommandInfo & ZigbeeCommandInfo;
export type ZigbeeBatteryGlobalCommandInfo = ZigbeeBatteryCommandInfo | ZigbeeCommandInfo;

@Directive()
export abstract class ZigbeeBatteryComponent<
  IE extends ZigbeeBatteryExtendCommandInfo = ZigbeeBatteryExtendCommandInfo, AE extends string = string,
  I extends string = string, A extends string = AE,
  C extends string = string, P extends string = string
> extends ZigbeeComponent <IE, AE, I, A, C, P>
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  batteryLowMin = 20;
  protected override infoCommandValues: Record<ZigbeeBatteryGlobalCommandInfo, string | number | boolean | null> = {
    battery: null,
    signal: null,
  };

  get hasLowBattery(): boolean {
    return (this.infoCommandValues.battery as number) < this.batteryLowMin;
  }

  get batteryIcon(): string {
    const battery = this.infoCommandValues.battery as number;

    if (battery < this.batteryLowMin) {
      return 'fa-battery-empty';
    } else if (battery < 30) {
      return 'fa-battery-quarter';
    } else if (battery < 60) {
      return 'fa-battery-half ';
    } else if (battery < 80) {
      return 'fa-battery-three-quarters ';
    }

    return 'fa-battery';
  }
}
