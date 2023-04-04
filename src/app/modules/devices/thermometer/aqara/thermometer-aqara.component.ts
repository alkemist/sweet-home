import { Component } from '@angular/core';
import { DeviceThermometerComponent } from '../thermometer.component';


@Component({
  selector: 'app-device-thermometer-lidl',
  templateUrl: '../thermometer.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermometer.component.scss',
  ],
})
export class DeviceThermometerAqaraComponent extends DeviceThermometerComponent {

}
