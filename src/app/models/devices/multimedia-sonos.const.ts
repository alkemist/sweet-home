import { Commands } from '../device-configurations.const';
import { MultimediaCommandAction, MultimediaCommandInfo } from './multimedia';

export type SonosExtendCommandInfo = SonosCommandInfo & MultimediaCommandInfo;
export type SonosGlobalCommandInfo = SonosCommandInfo | MultimediaCommandInfo;

export type SonosCommandInfo =
  'state'
  | 'shuffle' | 'repeat'
  | 'mute'
  | 'artist' | 'album' | 'title'
  ;

export type SonosExtendCommandAction = SonosCommandAction & MultimediaCommandAction;
export type SonosGlobalCommandAction = SonosCommandAction | MultimediaCommandAction;

export type SonosCommandAction =
  | 'shuffle' | 'repeat'
  | 'favourite' | 'playlist' | 'radio'
  ;

export const wifiMultimediaSonosInfoCommandFilters: Commands<SonosGlobalCommandInfo> = {
  state: { logicalId: 'state' },
  mute: { logicalId: 'mute_state' },
  volume: { logicalId: 'volume' },
  shuffle: { logicalId: 'shuffle_state' },
  repeat: { logicalId: 'repeat_state' },
  artist: { logicalId: 'track_artist' },
  album: { logicalId: 'track_album' },
  title: { logicalId: 'track_title' },
};

export const wifiMultimediaSonosActionCommandFilters: Commands<SonosGlobalCommandAction> = {
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
