import { Component, Input } from '@angular/core';
import { JeedomCommandResultInterface, SmartArrayModel } from '@models';
import { DeviceMultimediaComponent } from '../multimedia.component';

export type SonosCommandInfo = 'online';

export type SonosCommandAction = 'play';

@Component({
  selector: 'app-device-sonos',
  templateUrl: 'sonos.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    'sonos.component.scss',
  ],
})
export class DeviceSonosComponent extends DeviceMultimediaComponent {
  @Input() override actionInfoIds = new SmartArrayModel<SonosCommandInfo, number>();
  @Input() override actionCommandIds = new SmartArrayModel<SonosCommandAction, number>();

  override infoCommandValues: Record<SonosCommandInfo, boolean | null> = {
    online: null,
  };

  static override get infoCommandFilters(): Record<SonosCommandInfo, Record<string, string>> {
    return {
      online: { logicalId: '' },
    }
  }

  static override get actionCommandFilters(): Record<SonosCommandAction, Record<string, string>> {
    return {
      play: { logicalId: '' },
    }
  }

  /*toggle() {
    if (!this.isUserAction()) {
      return;
    }

    // console.log('-- Toggle on-off');

    this.execUpdate('toggle').then(_ => {
      this.infoCommandValues['state'] = !this.infoCommandValues['state'];
    })
  }*/

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }

  private execUpdate(commandAction: SonosCommandAction) {
    return super.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction
    );
  }
}
