import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ThermostatCommandInfo, ThermostatComponent } from '../thermostat.component';


@Component({
  selector: 'app-thermostat-aqara',
  templateUrl: '../thermostat.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermostat.component.scss',
  ],
})
export class ThermostatAqaraComponent extends ThermostatComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      ...super.infoCommandFilters,
      thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne 1' },
    }
  }
}
