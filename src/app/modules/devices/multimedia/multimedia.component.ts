import { Directive, Input } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { SmartArrayModel } from '@models';

export type MultimediaCommandInfo = 'online';
export type MultimediaCommandAction = 'play';

@Directive()
export abstract class DeviceMultimediaComponent extends BaseDeviceComponent {
  @Input() override actionInfoIds = new SmartArrayModel<any, number>();
  @Input() override actionCommandIds = new SmartArrayModel<any, number>();

  override infoCommandValues: Record<MultimediaCommandInfo, boolean | null> = {
    online: null
  };

  static override get infoCommandFilters(): Record<any, Record<string, string>> {
    return {
      online: { logicalId: '' },
    }
  }

  static override get actionCommandFilters(): Record<any, Record<string, string>> {
    return {
      play: { logicalId: '' },
    }
  }
}
