import {Component} from '@angular/core';
import {DeviceThermostatComponent} from '../thermostat.component';

@Component({
  selector: 'app-device-thermostat-moes',
  templateUrl: '../thermostat.component.html',
  styleUrls: [
    '../../../base-device.component.scss',
    '../../zigbee.component.scss',
    '../thermostat.component.scss',
  ],
})
export class DeviceThermostatMoesComponent extends DeviceThermostatComponent {
  override thermostatStep = 1;

}
