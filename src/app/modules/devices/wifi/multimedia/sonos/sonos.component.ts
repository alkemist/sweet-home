import { Component } from '@angular/core';
import { DeviceMultimediaComponent, MultimediaCommandValues, MultimediaState } from '../multimedia.component';
import {
  SonosCommandAction,
  SonosCommandInfo,
  SonosExtendCommandAction,
  SonosExtendCommandInfo,
  SonosGlobalCommandInfo,
  SonosParamValue
} from './sonos.const';
import { FormControl } from '@angular/forms';

interface SonosCommandValues extends MultimediaCommandValues {
  state: string,
  shuffle: boolean,
  repeat: boolean,
  artist: string,
  album: string,
  title: string,
}

@Component({
  selector: 'app-device-sonos',
  templateUrl: 'sonos.component.html',
  styleUrls: [
    '../../../base-device.component.scss',
    '../multimedia.component.scss',
    'sonos.component.scss',
  ],
})
export class DeviceSonosComponent
  extends DeviceMultimediaComponent<
    SonosExtendCommandInfo, SonosExtendCommandAction,
    SonosExtendCommandInfo,
    SonosCommandValues,
    SonosCommandInfo, SonosCommandAction, SonosParamValue
  > {
  shuffleControl = new FormControl<boolean>(true);
  repeatControl = new FormControl<boolean>(true);

  protected override infoCommandValues: SonosCommandValues = {
    ...super.infoCommandValues,
    state: "",
    shuffle: false,
    repeat: false,
    artist: "",
    album: "",
    title: "",
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

  override updateInfoCommandValues(values: Record<SonosGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.infoCommandValues.shuffle = values.shuffle === 1;
    this.infoCommandValues.repeat = values.repeat === 1;

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

    this.shuffleControl.setValue(this.infoCommandValues.shuffle, { emitEvent: false });
    this.repeatControl.setValue(this.infoCommandValues.repeat, { emitEvent: false });

    // console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
