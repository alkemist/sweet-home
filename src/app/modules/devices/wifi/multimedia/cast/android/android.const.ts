import { DeviceCommands } from '@devices';
import { AndroidGlobalCommandAction, AndroidGlobalCommandInfo } from './android.type';

export const MultimediaAndroidInfoCommandFilters: DeviceCommands<AndroidGlobalCommandInfo> = {
  online: { logicalId: '' },
  volume: { logicalId: '' },
  muted: { logicalId: '' },
  display: { logicalId: '' },
  player: { logicalId: '' },
  title: { logicalId: '' },
  artist: { logicalId: '' },
};

export const wifiMultimediaAndroidActionCommandFilters: DeviceCommands<AndroidGlobalCommandAction> = {
  backdrop: { logicalId: '' },
  volume: { logicalId: '' },
  mute: { logicalId: '' },
  unmute: { logicalId: '' },
  play: { logicalId: 'play' }, // @TODO OK
  pause: { logicalId: '' },
  previous: { logicalId: '' },
  back: { logicalId: '' },
  next: { logicalId: '' },
  stop: { logicalId: 'stop' }, // @TODO OK
};
