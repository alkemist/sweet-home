import { Component } from '@angular/core';
import { DeviceOnOffComponent } from '../on-off.component';


@Component({
  selector: 'app-device-on-off-moes',
  templateUrl: '../on-off.component.html',
  styleUrls: [
    '../../../base-device.component.scss',
    '../../zigbee.component.scss',
    '../on-off.component.scss',
  ],
})
export class DeviceOnOffMoesComponent extends DeviceOnOffComponent {
  override execToggle() {
    const isOn = this.infoCommandValues['state'] === 1;
    this.execUpdateValue(isOn ? 'off' : 'on').then(_ => {
      this.infoCommandValues['state'] = isOn ? 0 : 1;
    })
  }
}
