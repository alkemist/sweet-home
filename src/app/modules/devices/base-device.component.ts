import { Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { CoordinateInterface, SmartArrayModel } from '@models';
import { BaseComponent } from '../../components/base.component';
import { JeedomCommandResultInterface } from '../../models/jeedom-command-result.interface';
import { AppService, DeviceService } from '@services';

@Directive()
export abstract class BaseDeviceComponent extends BaseComponent implements OnInit, OnDestroy {
  @HostBinding('class.draggable') draggable: boolean = false;
  @Input() jeedomId?: number;
  @Input() position?: CoordinateInterface;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() actionInfoIds = new SmartArrayModel<string, number>();
  @Input() actionCommandIds = new SmartArrayModel<string, number>();
  infoCommandValues: Record<string, unknown> = {};

  public constructor(
    private appService: AppService,
    private deviceService: DeviceService
  ) {
    super();
  }

  static get infoCommandFilters(): Record<string, Record<string, string>> {
    return {};
  }

  static get actionCommandFilters(): Record<string, Record<string, string>> {
    return {};
  }

  ngOnInit() {
    if (this.position) {
      this.setPosition(this.position);
    }
  }

  setPosition(position: CoordinateInterface) {
    // console.log('-- Set device position', position);
    this.x = position.x + 'px';
    this.y = position.y + 'px';
  }

  updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    // console.log("-- Current info command values", this.infoCommandValues);
    // console.log("-- Update info command values", values);

    this.infoCommandValues = this.actionInfoIds.reduce((result, current) => {
      result[current.key] = values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key];
      return result;
    }, {} as Record<string, unknown>);

    // console.log('-- Updated info command values', this.infoCommandValues)
  }

  execCommand(commandId: number, commandName: string, commandValue: unknown) {
    return new Promise<any>(resolve => {
      const loader = this.appService.addLoader();
      this.deviceService.execAction(commandId, commandName, commandValue).then(_ => {
        // console.log('-- Exec action result', value);
        loader.finish();
        resolve(commandValue);
      });
    })
  }
}
