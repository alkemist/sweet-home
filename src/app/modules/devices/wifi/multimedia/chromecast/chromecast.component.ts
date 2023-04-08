import { Component } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { DeviceMultimediaComponent, MultimediaState } from '../multimedia.component';
import {
  ChromecastCommandAction,
  ChromecastCommandInfo,
  ChromecastExtendCommandAction,
  ChromecastExtendCommandInfo,
  ChromecastGlobalCommandInfo
} from './chromecast.const';


@Component({
  selector: 'app-device-chromecast',
  templateUrl: 'chromecast.component.html',
  styleUrls: [
    '../../../base-device.component.scss',
    '../multimedia.component.scss',
    'chromecast.component.scss',
  ],
})
export class DeviceChromecastComponent extends DeviceMultimediaComponent<
  ChromecastExtendCommandInfo, ChromecastExtendCommandAction,
  ChromecastCommandInfo, ChromecastCommandAction
> {
  override infoCommandValues: Record<ChromecastGlobalCommandInfo, string | number | boolean | null> = {
    ...super.infoCommandValues,
    online: null, //0-1
    muted: null, //0-1
    player: null, //"UNKNOWN", "PLAYING" (si en cours), "IDLE" ???
    status: null, //"&nbsp;",
    // "Netflix", "Diffusion: Netflix" (si en cours),
    // "Diffusion: Azalea Town" (si en cours, mais pas à jour)
    // "YouTube"
    // "Casting Prime Video"
    display: null, //
    // "Netflix",
    // "Spotify"
    // "Youtube"
    // "Prime Video"
    // "Backdrop"
    title: null, //"",
    // "Netflix"
    // "Green Hills" (titre en cours)
    // "RÉSUMÉ : MY HERO ACADEMIA : SAISON 5" (titre en cours)
    // "Les Épreuves de Vasselheim"
    artist: null,
    //
    // "Helynt, Koreskape, GameChops"
  };

  get isBackdrop(): boolean {
    return this.infoCommandValues.display === "Backdrop";
  }

  get application(): string {
    const application = this.infoCommandValues.display ?? '';
    if (this.isBackdrop) {
      return '';
    }
    return application.toString();
  }

  get stopDisabled() {
    return this.application === 'Netflix';
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    if (this.infoCommandValues.player === "PLAYING") {
      this.state = MultimediaState.playing;
    } else if (this.infoCommandValues.player === "PAUSED") {
      this.state = MultimediaState.paused;
    } else {
      this.state = MultimediaState.stopped;
    }

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }

  back(): Promise<void> {
    return this.execUpdateValue('back');
  }

  unCast(): Promise<void> {
    return this.execUpdateValue('backdrop').then(_ => {
      this.infoCommandValues.display = 'Backdrop';
    })
  }
}
