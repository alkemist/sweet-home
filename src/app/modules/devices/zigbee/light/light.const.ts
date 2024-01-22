import { DeviceCommands } from '@devices';
import { LightCommandAction, LightCommandInfo } from './light.type';

export const zigbeeLinkerLightInfoCommandFilters: DeviceCommands<LightCommandInfo> = {
  state: { generic_type: 'LIGHT_STATE' },
  brightness: { generic_type: 'LIGHT_BRIGHTNESS' },
  temperature: { generic_type: 'LIGHT_COLOR_TEMP' },
  color: { generic_type: 'LIGHT_COLOR' },
}

export const phillipsHueLightInfoCommandFilters: DeviceCommands<LightCommandInfo> = {
  ...zigbeeLinkerLightInfoCommandFilters,
  state: { logicalId: 'state' },
  brightness: { generic_type: 'LIGHT_STATE' },
}

export const zigbeeLinkerLightActionCommandFilters: DeviceCommands<LightCommandAction> = {
  on: { generic_type: 'LIGHT_ON' },
  off: { generic_type: 'LIGHT_OFF' },
  toggle: { generic_type: 'LIGHT_TOGGLE' },
  brightness: { generic_type: 'LIGHT_SLIDER' },
  temperature: { generic_type: 'LIGHT_SET_COLOR_TEMP' },
  color: { generic_type: 'LIGHT_SET_COLOR' },
}

export const phillipsHueLightActionCommandFilters: DeviceCommands<LightCommandAction> = {
  ...zigbeeLinkerLightActionCommandFilters
}
