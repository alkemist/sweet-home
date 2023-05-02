import {Directive} from '@angular/core';
import {BaseDeviceComponent} from '../../base-device.component';
import {FormControl} from '@angular/forms';
import {debounceTime} from 'rxjs';
import {MultimediaCommandAction, MultimediaCommandInfo, MultimediaParamValue} from '@devices';

export enum MultimediaState {
  offline,
  playing,
  paused,
  stopped
}

export interface MultimediaCommandValues extends Record<MultimediaCommandInfo | string, string | number | boolean | null> {
  volume: number,
  muted: boolean,
  title: string,
  artist: string,
}

export interface MultimediaParameterValues extends Record<MultimediaParamValue | string, string | number | boolean | null> {
  volumeMax: number,
}

@Directive()
export abstract class DeviceMultimediaComponent<
  IE extends MultimediaCommandInfo, AE extends MultimediaCommandAction,
  IV extends MultimediaCommandValues = MultimediaCommandValues,
  I extends string = string, A extends string = string, C extends string = string,
  P extends MultimediaParamValue = MultimediaParamValue,
  PV extends MultimediaParameterValues = MultimediaParameterValues,
>
  extends BaseDeviceComponent<IE, AE, IV, I, A | MultimediaCommandAction, C, P, PV> {

  volumeControl = new FormControl<number>(0);
  muteControl = new FormControl<boolean>(false);

  MultimediaState = MultimediaState;
  state: MultimediaState = MultimediaState.offline;

  protected override infoCommandValues: IV = {
    volume: 0,
    muted: false,
    title: "",
    artist: "",
  } as IV;

  get volumeMax() {
    return this.parameterValues.volumeMax;
  }

  get hasTitle() {
    return this.infoCommandValues.artist && this.infoCommandValues.artist !== 'Aucun';
  }

  override setParameterValues(values: Record<MultimediaParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.volumeMax = parseInt(values.volumeMax ?? '100');
  };

  override ngOnInit() {
    super.ngOnInit();

    this.sub = this.volumeControl.valueChanges
      .pipe(
        debounceTime(1000),
      )
      .subscribe((volume) => {
        if (volume) {
          void this.setVolume(volume);
        }
      })
    this.sub = this.muteControl.valueChanges
      .subscribe((mute) => {
        if (mute !== null) {
          void this.setMute(mute ? 'mute' : 'unmute').then(_ => {
            if (mute) {
              this.volumeControl.disable({emitEvent: false});
            } else {
              this.volumeControl.enable({emitEvent: false});
            }
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

  setMute(action: 'mute' | 'unmute'): Promise<void> {
    return this.execUpdateValue(action).then(_ => {
      this.infoCommandValues.muted = action === 'mute';
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

  stop(): Promise<void> {
    return this.execUpdateValue('stop').then(_ => {
      this.state = MultimediaState.stopped;
    })
  }

  previous(): Promise<void> {
    return this.execUpdateValue('previous');
  }

  next(): Promise<void> {
    return this.execUpdateValue('next');
  }

  override updateInfoCommandValues(values: Record<MultimediaCommandInfo, string | number | boolean | null>) {
    this.infoCommandValues.volume = values.volume as number ?? 0;
    this.infoCommandValues.muted = values.muted === 1;

    this.volumeControl.setValue(this.infoCommandValues.volume, {emitEvent: false});
    this.muteControl.setValue(this.infoCommandValues.muted, {emitEvent: false});

    // console.log(`-- [${ this.name }] Updated info command values`, values, this.infoCommandValues);
  }
}
