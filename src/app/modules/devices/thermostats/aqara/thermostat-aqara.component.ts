import { Component } from '@angular/core';
import { ThermostatComponent } from '@app/modules/devices/thermostats/thermostat.component';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat-aqara.component.html',
  styleUrls: [ '../thermostat.component.scss', './thermostat-aqara.component.scss' ],
})
export class ThermostatAqaraComponent extends ThermostatComponent {

}
