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
    this.execUpdateValue(this.infoCommandValues.state ? 'off' : 'on').then(_ => {
      this.infoCommandValues.state = !this.infoCommandValues.state;
    })
  }
}
