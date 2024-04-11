import { JeedomScenarioMode } from '@models';
import { JeedomScenarioState } from './jeedom-scenario-state.type';

export interface JeedomScenarioInterface {
  id: string;
  name: string;
  isActive: string; // "1" / "0"
  isVisible: string; // "1" / "0"

  object_id: string;
  order: string;
  scenarioElement: string[];
  schedule: string; // "3 * * * *"
  state: JeedomScenarioState;

  timeout: string; // "0"
  trigger: string[];
  has_return: number;
  logmode: string;
  description: string;
  display: {
    name: string;
    icon: string
  }
  lastLaunch: string;
  mode: JeedomScenarioMode;
}
