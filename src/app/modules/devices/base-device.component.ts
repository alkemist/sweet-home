import { Directive, HostBinding, Input } from '@angular/core';
import { CoordinateInterface, SmartArrayModel } from '@models';
import { BaseComponent } from '../../components/base.component';
import { JeedomCommandResultInterface } from '../../models/jeedom-command-result.interface';
import { AppService, DeviceService } from '@services';

@Directive()
export abstract class BaseDeviceComponent extends BaseComponent {
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

  override ngOnInit() {
    super.ngOnInit();

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
    console.log("-- Update info command values", values);

    this.infoCommandValues = this.actionInfoIds.reduce((result, current) => {
      result[current.key] = values[current.value]
        ? values[current.value].value
        : this.infoCommandValues[current.key];
      return result;
    }, {} as Record<string, unknown>);
  }

  updateInfoCommandValue(commandId: number, value: JeedomCommandResultInterface) {
    this.updateInfoCommandValues({ [commandId]: value });
  }

  execUpdate(commandId: number, commandValue: unknown, commandName: string) {
    this.appService.beginLoading();
    this.deviceService.execAction(commandId, commandValue, commandName).then((value) => {
      if (value) {
        this.updateInfoCommandValue(commandId, value);
      }
      this.appService.endLoading();
    });
  }

  execAction(commandId: number, commandValue: unknown, commandName: string) {
    this.appService.beginLoading();
    this.deviceService.execAction(commandId, commandValue, commandName).then((result) => {
      console.log('-- Exec action', result);
      this.appService.endLoading();
    })
  }
}
