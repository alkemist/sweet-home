import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import BaseComponent from "@base-component";
import { JeedomService } from '@services';
import { JeedomScenarioModel } from '../../../../../models/jeedom/jeedom-scenario.model';
import { JeedomScenarioState } from '@models';


@Component({
  templateUrl: "./scenarios.component.html",
  styleUrls: [ "./scenarios.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenariosComponent extends BaseComponent implements OnInit, OnDestroy {
  scenarios = signal<JeedomScenarioModel[]>([]);
  loaded = signal<boolean>(false);
  maxRows = 100;

  constructor(
    private jeedomService: JeedomService,
  ) {
    super();
  }

  ngOnInit() {
    void this.loadScenarios()
  }

  async loadScenarios() {
    this.scenarios.set(await this.jeedomService.listScenarios());
    this.loaded.set(true);
  }

  async changeState(scenario: JeedomScenarioModel, state: JeedomScenarioState) {
    this.loaded.set(false);
    await this.jeedomService.setScenarioState(scenario.id, state);
    void this.loadScenarios();
  }
}
