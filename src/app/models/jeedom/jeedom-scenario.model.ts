import { JeedomScenarioInterface, JeedomScenarioMode, JeedomScenarioState } from '@models';

export class JeedomScenarioModel {
  id: string;
  name: string;
  state: JeedomScenarioState;
  mode: JeedomScenarioMode;
  isActive: boolean;
  isVisible: boolean;

  constructor(data: JeedomScenarioInterface) {
    this.id = data.id;
    this.name = data.name;
    this.state = data.state;
    this.isActive = data.isActive === "1";
    this.isVisible = data.isVisible === "1";
    this.mode = data.mode;
  }
}
