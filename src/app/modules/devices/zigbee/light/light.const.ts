import { DeviceCommands } from '@devices';
import { LightCommandAction, LightCommandInfo, LightParamValue } from './light.type';

export const zigbeeLinkerLightInfoCommandFilters: DeviceCommands<LightCommandInfo> = {
  state: { generic_type: 'LIGHT_STATE' },
  brightness: { generic_type: 'LIGHT_BRIGHTNESS' },
  color: { generic_type: 'LIGHT_COLOR_TEMP' },
}

export const zigbeeLinkerLightActionCommandFilters: DeviceCommands<LightCommandAction> = {
  on: { generic_type: 'LIGHT_ON' },
  off: { generic_type: 'LIGHT_OFF' },
  toggle: { generic_type: 'LIGHT_TOGGLE' },
  brightness: { generic_type: 'LIGHT_SLIDER' },
  color: { generic_type: 'LIGHT_SET_COLOR_TEMP' },
}

export const LightParams: LightParamValue[] = [ 'colorMin', 'colorMax' ];
