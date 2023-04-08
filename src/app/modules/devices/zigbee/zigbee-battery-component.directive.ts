import { AfterContentInit, AfterViewInit, Directive, OnDestroy, OnInit } from '@angular/core';
import { ZigbeeCommandInfo, ZigbeeCommandValues, ZigbeeComponent } from './zigbee-component.directive';
import { MathHelper } from '@tools';

export type ZigbeeBatteryCommandInfo = 'battery';

export type ZigbeeBatteryExtendCommandInfo = ZigbeeBatteryCommandInfo & ZigbeeCommandInfo;
export type ZigbeeBatteryGlobalCommandInfo = ZigbeeBatteryCommandInfo | ZigbeeCommandInfo;

export interface ZigbeeBatteryCommandValues extends ZigbeeCommandValues {
  battery: number,
}

@Directive()
export abstract class ZigbeeBatteryComponent<
  IE extends ZigbeeBatteryExtendCommandInfo = ZigbeeBatteryExtendCommandInfo, AE extends string = string,
  IG extends ZigbeeBatteryGlobalCommandInfo = ZigbeeBatteryGlobalCommandInfo,
  IV extends ZigbeeBatteryCommandValues = ZigbeeBatteryCommandValues,
  I extends string = IE, A extends string = AE,
  C extends string = string,
  P extends string = string,
  PV extends Record<P, string | number | boolean | null> = Record<P, string | number | boolean | null>,
> extends ZigbeeComponent <IE, AE, IE, IV, I, A, C, P, PV>
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  batteryLowMin = 20;
  protected override infoCommandValues: IV = {
    battery: 0,
    signal: 0,
  } as IV;

  get hasLowBattery(): boolean {
    return this.infoCommandValues.battery < this.batteryLowMin;
  }

  get batteryIcon(): string {
    if (this.infoCommandValues.battery < this.batteryLowMin) {
      return 'fa-battery-empty';
    } else if (this.infoCommandValues.battery < 30) {
      return 'fa-battery-quarter';
    } else if (this.infoCommandValues.battery < 60) {
      return 'fa-battery-half ';
    } else if (this.infoCommandValues.battery < 80) {
      return 'fa-battery-three-quarters ';
    }

    return 'fa-battery';
  }

  override updateInfoCommandValues(values: Record<ZigbeeBatteryGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.battery = MathHelper.round(values.battery as number, 0);
  }
}
