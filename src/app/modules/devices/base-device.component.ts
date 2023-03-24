import { Directive, HostBinding, Input } from '@angular/core';
import { CoordinateInterface, SmartArrayModel } from '@models';
import { BaseComponent } from '../../components/base.component';
import { JeedomCommandResultInterface } from '../../models/jeedom-command-result.interface';

@Directive()
export abstract class BaseDeviceComponent extends BaseComponent {
  @HostBinding('class.draggable') draggable: boolean = false;
  @Input() jeedomId?: number;
  @Input() position?: CoordinateInterface;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() commandIds: SmartArrayModel<string, number> = new SmartArrayModel<string, number>();
  commandValues: Record<string, JeedomCommandResultInterface | null> = {};

  public constructor() {
    super();
  }

  static get commandFilters(): Record<string, Record<string, string>> {
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

  setCommandValues(values: Record<number, JeedomCommandResultInterface | null>) {
    this.commandValues = this.commandIds.reduce((result, current) => {
      result[current.key] = values[current.value];
      return result;
    }, {} as Record<string, JeedomCommandResultInterface | null>);

    console.log('-- Set commands values', this.commandValues);
  }
}
