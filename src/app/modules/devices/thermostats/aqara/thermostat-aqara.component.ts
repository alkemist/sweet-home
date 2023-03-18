import { Component } from '@angular/core';
import { ThermostatComponent } from '../thermostat.component';

@Component({
  selector: 'app-thermostat-aqara',
  templateUrl: './thermostat-aqara.component.html',
  styleUrls: [
    '../../device.component.scss',
    '../thermostat.component.scss',
    './thermostat-aqara.component.scss'
  ],
})
export class ThermostatAqaraComponent extends ThermostatComponent {

}
