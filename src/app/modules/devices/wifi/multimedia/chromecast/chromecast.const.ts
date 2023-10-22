import { DeviceCommands } from '@devices';
import { ChromecastGlobalCommandAction, ChromecastGlobalCommandInfo } from './chromecast.type';

export const MultimediaChromecastInfoCommandFilters: DeviceCommands<ChromecastGlobalCommandInfo> = {
  online: { logicalId: 'online' },
  volume: { logicalId: 'volume_level' },
  muted: { logicalId: 'volume_muted' },
  player: { logicalId: 'player_state' },
  //"UNKNOWN", "PLAYING" (si en cours), "IDLE" ???
  // status: {logicalId: 'status_text'},
  //"&nbsp;",
  // "Netflix", "Diffusion: Netflix" (si en cours),
  // "Diffusion: Azalea Town" (si en cours, mais pas à jour)
  // "YouTube"
  // "Casting Prime Video"
  display: { logicalId: 'display_name' },
  // "Netflix",
  // "Spotify"
  // "Youtube"
  // "Prime Video"
  // "Backdrop"
  title: { logicalId: 'title' },
  //"",
  // "Netflix"
  // "Green Hills" (titre en cours)
  // "RÉSUMÉ : MY HERO ACADEMIA : SAISON 5" (titre en cours)
  // "Les Épreuves de Vasselheim"
  artist: { logicalId: 'artist' },
  // "Helynt, Koreskape, GameChops"
};

export const wifiMultimediaChromecastActionCommandFilters: DeviceCommands<ChromecastGlobalCommandAction> = {
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
