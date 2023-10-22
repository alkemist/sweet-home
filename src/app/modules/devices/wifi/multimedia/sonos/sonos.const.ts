import { DeviceCommands, DeviceConfiguration } from '@devices';
import { SonosConfiguration, SonosGlobalCommandAction, SonosGlobalCommandInfo } from './sonos.type';

export const wifiMultimediaSonosInfoCommandFilters: DeviceCommands<SonosGlobalCommandInfo> = {
  state: { logicalId: 'state' },
  muted: { logicalId: 'mute_state' },
  volume: { logicalId: 'volume' },
  shuffle: { logicalId: 'shuffle_state' },
  repeat: { logicalId: 'repeat_state' },
  artist: { logicalId: 'track_artist' },
  album: { logicalId: 'track_album' },
  title: { logicalId: 'track_title' },
};

export const wifiMultimediaSonosActionCommandFilters: DeviceCommands<SonosGlobalCommandAction> = {
  play: { logicalId: 'play' },
  pause: { logicalId: 'pause' },
  stop: { logicalId: 'stop' },
  previous: { logicalId: 'previous' },
  next: { logicalId: 'next' },
  mute: { logicalId: 'mute' },
  unmute: { logicalId: 'unmute' },
  volume: { logicalId: 'setVolume' },
  shuffle: { logicalId: 'shuffle' },
  repeat: { logicalId: 'repeat' },
  favourite: { logicalId: 'play_favourite' },
  playlist: { logicalId: 'play_playlist' },
  radio: { logicalId: 'play_radio' },
};

export const wifiMultimediaSonosConfigurationFilters: DeviceConfiguration<SonosConfiguration> = {
  ip: "logicalId"
}
