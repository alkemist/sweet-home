import { Component } from '@angular/core';
import { DeviceOnOffComponent } from '../on-off.component';


@Component({
  selector: 'app-device-onoff-lidl',
  templateUrl: '../on-off.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../on-off.component.scss',
  ],
})
export class DeviceOnOffPlugLidlComponent extends DeviceOnOffComponent {

}
