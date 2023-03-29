import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { FormControl } from '@angular/forms';
import {
  JeedomCommandResultInterface,
  MultimediaCommandAction,
  MultimediaCommandInfo,
  MultimediaParamValue
} from '@models';
import { debounceTime } from 'rxjs';

export enum MultimediaState {
  playing,
  paused,
  stopped
}

@Directive()
export abstract class DeviceMultimediaComponent<
  IE extends MultimediaCommandInfo, AE extends MultimediaCommandAction,
  I extends string, A extends string
>
  extends BaseDeviceComponent<IE, AE, I, A | MultimediaCommandAction, MultimediaParamValue> {

  volumeControl = new FormControl<number>(0);

  MultimediaState = MultimediaState;
  state: MultimediaState = MultimediaState.stopped;

  protected override infoCommandValues: Record<MultimediaCommandInfo, string | number | boolean | null> = {
    volume: null,
  };

  get volumeMax() {
    return this.paramValues.volumeMax as number ?? 100;
  }

  override ngOnInit() {
    super.ngOnInit();

    this.sub = this.volumeControl.valueChanges
      .pipe(
        debounceTime(1000),
      )
      .subscribe((volume) => {
        if (volume) {
          this.setVolume(volume).then(_ => {
            this.infoCommandValues.volume = volume;
          })
        }
      })
  }

  override closeModal() {
    super.closeModal();
  }

  setVolume(volume: number): Promise<void> {
    return this.execUpdateSlider('volume', volume).then(_ => {
      this.infoCommandValues.volume = volume;
    })
  }

  play(): Promise<void> {
    return this.execUpdateValue('play').then(_ => {
      this.state = MultimediaState.playing;
    })
  }

  pause(): Promise<void> {
    return this.execUpdateValue('pause').then(_ => {
      this.state = MultimediaState.paused;
    })
  }

  previous(): Promise<void> {
    return this.execUpdateValue('previous');
  }

  next(): Promise<void> {
    return this.execUpdateValue('next');
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    if (!this.modalOpened) {
      this.volumeControl.setValue(this.infoCommandValues.volume as number, { emitEvent: false });
    }
  }
}
