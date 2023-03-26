import { AfterContentInit, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ThermostatCommandInfo, ThermostatComponent } from '../thermostat.component';


@Component({
  selector: 'app-thermostat-moes',
  templateUrl: '../thermostat.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../thermostat.component.scss',
  ],
})
export class ThermostatMoesComponent extends ThermostatComponent implements OnInit, AfterContentInit, AfterViewInit, OnDestroy {
  override thermostatStep = 1;

  static override get infoCommandFilters(): Record<ThermostatCommandInfo, Record<string, string>> {
    return {
      ...super.infoCommandFilters,
      thermostat: { generic_type: 'THERMOSTAT_SETPOINT', name: 'Consigne' },
    }
  }
}
