import { Directive, Input } from '@angular/core';
import { CoordinateInterface } from '@models';
import { BaseComponent } from '@components';

@Directive()
export abstract class BaseDeviceComponent extends BaseComponent {
  @Input() objectId?: number;
  @Input() position?: CoordinateInterface;
  @Input() commands?: Record<string, number>;

  public constructor() {
    super();
  }
}
