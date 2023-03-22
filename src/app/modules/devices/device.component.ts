import { Directive, HostBinding, Input } from '@angular/core';
import { CoordinateInterface } from '@models';
import { BaseComponent } from '../../components/base.component';

@Directive()
export abstract class BaseDeviceComponent extends BaseComponent {
  @HostBinding('class.draggable') draggable: boolean = false;
  @Input() objectId?: number;
  @Input() position?: CoordinateInterface;
  @HostBinding('style.left') x = '0px';
  @HostBinding('style.top') y = '0px';
  @Input() commands?: Record<string, number>;

  public constructor() {
    super();
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
}
