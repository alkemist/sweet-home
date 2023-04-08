import { Component } from '@angular/core';
import { DeviceMultimediaComponent, MultimediaCommandValues, MultimediaState } from '../multimedia.component';
import {
  ChromecastCommandAction,
  ChromecastCommandInfo,
  ChromecastExtendCommandAction,
  ChromecastExtendCommandInfo,
  ChromecastGlobalCommandInfo
} from './chromecast.const';

interface ChromecastCommandValues extends MultimediaCommandValues {
  online: boolean,
  player: string,
  status: string,
  display: string,
  title: string,
  artist: string,
}

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
  ChromecastExtendCommandInfo,
  ChromecastCommandValues,
  ChromecastCommandInfo, ChromecastCommandAction
> {
  override infoCommandValues: ChromecastCommandValues = {
    ...super.infoCommandValues,
    online: false, //0-1
    player: "", //"UNKNOWN", "PLAYING" (si en cours), "IDLE" ???
    status: "", //"&nbsp;",
    // "Netflix", "Diffusion: Netflix" (si en cours),
    // "Diffusion: Azalea Town" (si en cours, mais pas à jour)
    // "YouTube"
    // "Casting Prime Video"
    display: "", //
    // "Netflix",
    // "Spotify"
    // "Youtube"
    // "Prime Video"
    // "Backdrop"
    title: "", //"",
    // "Netflix"
    // "Green Hills" (titre en cours)
    // "RÉSUMÉ : MY HERO ACADEMIA : SAISON 5" (titre en cours)
    // "Les Épreuves de Vasselheim"
    artist: "",
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

  back(): Promise<void> {
    return this.execUpdateValue('back');
  }

  unCast(): Promise<void> {
    return this.execUpdateValue('backdrop').then(_ => {
      this.infoCommandValues.display = 'Backdrop';
    })
  }

  override updateInfoCommandValues(values: Record<ChromecastGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.online = values.online === 1;

    if (this.infoCommandValues.player === "PLAYING") {
      this.state = MultimediaState.playing;
    } else if (this.infoCommandValues.player === "PAUSED") {
      this.state = MultimediaState.paused;
    } else {
      this.state = MultimediaState.stopped;
    }

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
