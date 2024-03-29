import { AfterContentInit, AfterViewInit, Directive, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import BaseDeviceComponent from "@base-device-component";
import { DeviceCommandHistory } from '@models';
import { MathHelper } from '@alkemist/smart-tools';

export type ZigbeeCommandInfo = 'signal';

export interface ZigbeeCommandValues extends Record<ZigbeeCommandInfo | string, string | number | boolean | null> {
  signal: number
}

@Directive()
export abstract class ZigbeeComponent<
  IE extends ZigbeeCommandInfo = ZigbeeCommandInfo,
  AE extends string = string,
  IV extends ZigbeeCommandValues = ZigbeeCommandValues,
  I extends string = IE,
  A extends string = AE,
  C extends string = string,
  P extends string = string,
  PV extends Record<P, string | number | boolean | null> = Record<P, string | number | boolean | null>,
> extends BaseDeviceComponent <IE, AE, I, A, C, IV, P, PV>
  implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {
  deviceCommands: DeviceCommandHistory[] = [];

  protected override infoCommandValues: WritableSignal<IV> = signal<IV>({
    signal: 0,
  } as IV);

  get signalPercent() {
    return MathHelper.round(this.infoCommandValues().signal * 100 / 255, 0);
  }

  protected addDeviceCommandHistory(commandName: I) {
    this.deviceCommands.push({
      deviceName: this.name,
      commandName: commandName,
      commandId: this.actionInfoIds.get(commandName),
      history: []
    });
  }
}
