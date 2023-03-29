import { Commands } from '../device-configurations.const';
import { MultimediaCommandAction, MultimediaCommandInfo } from './multimedia';

export type ChromecastExtendCommandInfo = ChromecastCommandInfo & MultimediaCommandInfo;
export type ChromecastGlobalCommandInfo = ChromecastCommandInfo | MultimediaCommandInfo;

export type ChromecastCommandInfo =
  'online'
  | 'muted'
  | 'player'
  | 'status' | 'display'
  | 'title' | 'artist'
  ;

export type ChromecastExtendCommandAction = ChromecastCommandAction & MultimediaCommandAction;
export type ChromecastGlobalCommandAction = ChromecastCommandAction | MultimediaCommandAction;

export type ChromecastCommandAction =
  'uncast' | 'backdrop' | 'back'
  ;

export const MultimediaChromecastInfoCommandFilters: Commands<ChromecastGlobalCommandInfo> = {
  online: { logicalId: 'online' },
  volume: { logicalId: 'volume_level' },
  muted: { logicalId: 'volume_muted' },
  player: { logicalId: 'player_state' },
  status: { logicalId: 'status_text' },
  display: { logicalId: 'display_name' },
  title: { logicalId: 'title' },
  artist: { logicalId: 'artist' },
};

export const wifiMultimediaChromecastActionCommandFilters: Commands<ChromecastGlobalCommandAction> = {
  uncast: { logicalId: 'quit_app' },
  backdrop: { logicalId: 'app=backdrop' },
  volume: { logicalId: 'volume_set' },
  mute: { logicalId: 'mute_on' },
  unmute: { logicalId: 'mute_off' },
  play: { logicalId: 'play' },
  pause: { logicalId: 'pause' },
  previous: { logicalId: 'prev' },
  back: { logicalId: 'rewind' },
  next: { logicalId: 'skip' },
  stop: { logicalId: 'stop' },
};
