import { Component, Input } from '@angular/core';
import { JeedomCommandResultInterface, SmartArrayModel } from '@models';
import { DeviceMultimediaComponent } from '../multimedia.component';

export type ChromecastCommandInfo = 'online'
  | 'volume' | 'muted'
  | 'playing' | 'player'
  | 'status' | 'display' | 'title' | 'artist'
  ;

export type ChromecastCommandAction = 'uncast' | 'backdrop'
  | 'volume' | 'mute_on' | 'mute_off'
  | 'play' | 'pause' | 'prev' | 'back' | 'next' | 'stop'
  ;

@Component({
  selector: 'app-device-chromecast',
  templateUrl: 'chromecast.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    'chromecast.component.scss',
  ],
})
export class DeviceChromecastComponent extends DeviceMultimediaComponent {
  @Input() override actionInfoIds = new SmartArrayModel<ChromecastCommandInfo, number>();
  @Input() override actionCommandIds = new SmartArrayModel<ChromecastCommandAction, number>();

  override infoCommandValues: Record<ChromecastCommandInfo, boolean | null> = {
    online: null, //0-1
    volume: null, //0-100
    muted: null, //0-1
    playing: null, //"6588411e-e513-2f28-d595-400837b04510"
    player: null, //"UNKNOWN", "PLAYING" (si en cours), "IDLE" ???
    status: null, //"&nbsp;",
    // "Netflix", "Diffusion: Netflix" (si en cours),
    // "Diffusion: Azalea Town" (si en cours, mais pas à jour)
    display: null, //
    // "Netflix",
    // "Spotify"
    title: null, //"",
    // "Netflix"
    // "Green Hills" (titre en cours)
    artist: null,
    //
    // "Helynt, Koreskape, GameChops"
  };

  static override get infoCommandFilters(): Record<ChromecastCommandInfo, Record<string, string>> {
    return {
      online: { logicalId: 'online' },
      volume: { logicalId: 'volume_level' },
      muted: { logicalId: 'volume_muted' },
      playing: { logicalId: 'nowplaying' },
      player: { logicalId: 'player_state' },
      status: { logicalId: 'status_text' },
      display: { logicalId: 'display_name' },
      title: { logicalId: 'title' },
      artist: { logicalId: 'artist' },
    }
  }

  static override get actionCommandFilters(): Record<ChromecastCommandAction, Record<string, string>> {
    return {
      uncast: { logicalId: 'quit_app' },
      backdrop: { logicalId: 'app=backdrop' },
      volume: { logicalId: 'volume_set' },
      mute_on: { logicalId: 'mute_on' },
      mute_off: { logicalId: 'mute_off' },
      play: { logicalId: 'play' },
      pause: { logicalId: 'pause' },
      prev: { logicalId: 'prev' },
      back: { logicalId: 'rewind' },
      //
      // début de la chanson
      next: { logicalId: 'skip' },
      stop: { logicalId: 'stop' },
      // Quitte la lecture en cours
      // Quit spotify
    }
  }

  /*toggle() {
    if (!this.isUserAction()) {
      return;
    }

    // console.log('-- Toggle on-off');

    this.execUpdate('toggle').then(_ => {
      this.infoCommandValues['state'] = !this.infoCommandValues['state'];
    })
  }*/

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }

  private execUpdate(commandAction: ChromecastCommandAction) {
    return super.execCommand(
      this.actionCommandIds.get(commandAction),
      commandAction
    );
  }
}
