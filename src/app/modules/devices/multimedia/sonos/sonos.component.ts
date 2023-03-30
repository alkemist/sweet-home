import { Component } from '@angular/core';
import {
  JeedomCommandResultInterface,
  SonosCommandAction,
  SonosCommandInfo,
  SonosExtendCommandAction,
  SonosExtendCommandInfo,
  SonosGlobalCommandInfo
} from '@models';
import { DeviceMultimediaComponent, MultimediaState } from '../multimedia.component';

@Component({
  selector: 'app-device-sonos',
  templateUrl: 'sonos.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../multimedia.component.scss',
    'sonos.component.scss',
  ],
})
export class DeviceSonosComponent
  extends DeviceMultimediaComponent<
    SonosExtendCommandInfo, SonosExtendCommandAction,
    SonosCommandInfo, SonosCommandAction
  > {
  playerShowed = true;

  protected override infoCommandValues: Record<SonosGlobalCommandInfo, string | number | boolean | null> = {
    ...super.infoCommandValues,
    state: null, // "Lecture"
    muted: null, // 0, 1
    shuffle: null, // 0, 1
    repeat: null, // 0, 1
    artist: null,
    album: null,
    title: null,
  };

  shuffle() {
    void this.execUpdateValue("shuffle")
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    if (this.infoCommandValues.title !== "Entrée de ligne") {
      this.playerShowed = true;

      if (this.infoCommandValues.state === "Lecture") {
        this.state = MultimediaState.playing;
      } else if (this.infoCommandValues.state === "Pause") {
        this.state = MultimediaState.paused;
      }
    } else {
      this.playerShowed = false;
      this.state = MultimediaState.stopped;
    }

    console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
