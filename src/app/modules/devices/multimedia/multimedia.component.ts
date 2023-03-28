import { Directive } from '@angular/core';
import { BaseDeviceComponent } from '../base-device.component';
import { FormControl } from '@angular/forms';
import { JeedomCommandResultInterface } from '@models';
import { debounceTime } from 'rxjs';

export type MultimediaCommandInfo = 'volume';
export type MultimediaCommandAction = 'volume';
export type MultimediaParamValue = 'volumeMax';

@Directive()
export abstract class DeviceMultimediaComponent<I extends MultimediaCommandInfo, A extends MultimediaCommandAction>
  extends BaseDeviceComponent<I, A, MultimediaParamValue> {
  volumeControl = new FormControl<number>(0);

  static override get infoCommandFilters(): Record<any, Record<string, string>> {
    return {
      volume: {},
    }
  }

  static override get actionCommandFilters(): Record<any, Record<string, string>> {
    return {
      volume: {},
    }
  }

  protected override _infoCommandValues: Record<I, number | string | null> = {
    volume: null
  } as Record<I, number | string | null>;

  override get infoCommandValues() {
    return this._infoCommandValues as Record<MultimediaCommandInfo, number | string | null>;
  }

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
            this.infoCommandValues['volume'] = volume;
          })
        }
      })
  }

  override closeModal() {
    super.closeModal();
  }

  setVolume(volume: number): Promise<void> {
    return this.execUpdateSlider('volume' as A, volume).then(_ => {
      this.infoCommandValues['volume'] = volume;
    })
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);
    if (!this.modalOpened) {
      this.volumeControl.setValue(this.infoCommandValues.volume as number, { emitEvent: false });
    }
  }
}
