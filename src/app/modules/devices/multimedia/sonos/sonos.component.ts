import { Component } from '@angular/core';
import { JeedomCommandResultInterface, } from '@models';
import { DeviceMultimediaComponent, MultimediaState } from '../multimedia.component';
import {
  SonosCommandAction,
  SonosCommandInfo,
  SonosConfiguration,
  SonosExtendCommandAction,
  SonosExtendCommandInfo,
  SonosGlobalCommandInfo
} from './sonos.const';
import { FormControl } from '@angular/forms';

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
    SonosCommandInfo, SonosCommandAction,
    SonosConfiguration
  > {
  shuffleControl = new FormControl<boolean>(true);
  repeatControl = new FormControl<boolean>(true);

  protected override infoCommandValues: Record<SonosGlobalCommandInfo, string | number | boolean | null> = {
    ...super.infoCommandValues,
    state: null,
    shuffle: null,
    repeat: null,
    artist: null,
    album: null,
    title: null,
  };

  get hasTitle() {
    return this.infoCommandValues.artist !== 'Aucun';
  }

  get hasTvSound() {
    return this.infoCommandValues.title === 'Entrée de ligne';
  }

  override ngOnInit() {
    super.ngOnInit();

    this.sub = this.shuffleControl.valueChanges
      .subscribe((shuffle) => {
        if (shuffle !== null) {
          void this.execUpdateValue("shuffle").then(_ => {
            this.infoCommandValues.shuffle = !shuffle;
          })
        }
      })

    this.sub = this.repeatControl.valueChanges
      .subscribe((repeat) => {
        if (repeat !== null) {
          void this.execUpdateValue("repeat").then(_ => {
            this.infoCommandValues.repeat = !repeat;
          })
        }
      })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    if (!this.hasTvSound) {
      if (this.infoCommandValues.state === "Lecture") {
        this.state = MultimediaState.playing;
      } else if (this.infoCommandValues.state === "Pause") {
        this.state = MultimediaState.paused;
      } else if (this.infoCommandValues.state === "Arrêté") {
        this.state = MultimediaState.stopped;
      }
    } else {
      this.state = MultimediaState.stopped;
    }

    this.shuffleControl.setValue(this.infoCommandValues.shuffle as boolean, { emitEvent: false });
    this.repeatControl.setValue(this.infoCommandValues.repeat as boolean, { emitEvent: false });

    console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
