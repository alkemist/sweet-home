import { Directive, signal, WritableSignal } from "@angular/core";
import { MultimediaCommandAction, MultimediaCommandInfo, MultimediaParamValue } from "@devices";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs";
import BaseDeviceComponent from "@base-device-component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { MultimediaCommandValues, MultimediaParameterValues } from './multimedia.interface';
import { MultimediaState } from "./multimedia.enum";


@Directive()
export abstract class DeviceMultimediaComponent<
  IE extends MultimediaCommandInfo,
  AE extends MultimediaCommandAction,
  I extends string,
  A extends string = string,
  C extends string = string,
  IV extends MultimediaCommandValues = MultimediaCommandValues,
  P extends MultimediaParamValue = MultimediaParamValue,
  PV extends MultimediaParameterValues = MultimediaParameterValues,
>
  extends BaseDeviceComponent<IE, AE, I | MultimediaCommandInfo, A | MultimediaCommandAction, C, IV, P, PV> {

  volumeControl = new FormControl<number>(0);
  muteControl = new FormControl<boolean>(false);

  MultimediaState = MultimediaState;
  state: MultimediaState = MultimediaState.offline;

  protected override infoCommandValues: WritableSignal<IV> = signal<IV>({
    volume: 0,
    muted: false,
    title: "",
    artist: "",
  } as IV);

  get volumeMax() {
    return this.parameterValues.volumeMax;
  }

  get hasTitle() {
    return this.infoCommandValues().artist && this.infoCommandValues().artist !== "Aucun";
  }

  override setParameterValues(values: Record<MultimediaParamValue, string | undefined>) {
    super.setParameterValues(values);
    this.parameterValues.volumeMax = parseInt(values.volumeMax ?? "100");
  };

  override ngOnInit() {
    super.ngOnInit();

    this.volumeControl.valueChanges
      .pipe(
        debounceTime(1000),
        takeUntilDestroyed(this)
      )
      .subscribe((volume) => {
        if (volume !== null) {
          void this.setVolume(volume);
        }
      });
    this.muteControl.valueChanges
      .pipe(
        takeUntilDestroyed(this)
      )
      .subscribe((mute) => {
        if (mute !== null) {
          void this.setMute(mute ? "mute" : "unmute").then(_ => {
            if (mute) {
              this.volumeControl.disable({ emitEvent: false });
            } else {
              this.volumeControl.enable({ emitEvent: false });
            }
          });
        }
      });
  }

  override closeModal() {
    super.closeModal();

    document.removeEventListener("volumeupbutton", this.upVolumeButton, false);
    document.removeEventListener("volumedownbutton", this.downVolumeButton, false);
  }

  async setVolume(volume: number): Promise<void> {
    await this.execUpdateSlider("volume", volume);
    this.updateInfoCommandValue('volume', volume);
  }

  async setMute(action: "mute" | "unmute"): Promise<void> {
    await this.execUpdateValue(action);
    this.updateInfoCommandValue('muted', action === "mute")
  }

  async play(): Promise<void> {
    await this.execUpdateValue("play");
    this.state = MultimediaState.playing;
  }

  async pause(): Promise<void> {
    await this.execUpdateValue("pause");
    this.state = MultimediaState.paused;
  }

  async stop(): Promise<void> {
    await this.execUpdateValue("stop");
    this.state = MultimediaState.stopped;
  }

  previous(): Promise<void> {
    return this.execUpdateValue("previous");
  }

  next(): Promise<void> {
    return this.execUpdateValue("next");
  }

  override openModal() {
    super.openModal();

    document.addEventListener("volumeupbutton", this.upVolumeButton, false);
    document.addEventListener("volumedownbutton", this.downVolumeButton, false);
  }

  updateInfoCommandValues(values: Record<MultimediaCommandInfo, string | number | boolean | null>) {
    this.patchInfoCommandValues({
      volume: values.volume as number ?? 0,
      muted: values.muted === 1
    } as Partial<IV>)

    this.volumeControl.setValue(this.infoCommandValues().volume, { emitEvent: false });
    this.muteControl.setValue(this.infoCommandValues().muted, { emitEvent: false });

    // console.log(`-- [${ this.name }] Updated info command values`, values, this.infoCommandValues());
  }

  upVolumeButton = () => {
    this.upDownButton(1);
  };

  downVolumeButton = () => {
    this.upDownButton(-1);
  };

  private upDownButton(step: number) {
    let volumeValue = this.volumeControl.value;
    if (volumeValue) {
      volumeValue += step;
      this.volumeControl.setValue(volumeValue);
    }
  }
}
