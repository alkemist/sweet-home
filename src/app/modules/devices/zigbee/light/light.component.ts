import { Directive, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ZigbeeLightCommandValues, ZigbeeLightParameterValues } from './light.interface';
import { LightCommandAction, LightExtendCommandInfo, LightGlobalCommandInfo, LightParamValue } from './light.type';
import { ZigbeeComponent } from '../zigbee-component.directive';
import { debounceTime } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Directive()
export abstract class DeviceLightComponent
  extends ZigbeeComponent<
    LightExtendCommandInfo, LightCommandAction,
    ZigbeeLightCommandValues,
    string, string, string,
    LightParamValue, ZigbeeLightParameterValues> {

  override infoCommandValues: WritableSignal<ZigbeeLightCommandValues> = signal<ZigbeeLightCommandValues>({
    ...super.infoCommandSignalValues,
    state: false,
  });

  size = {
    w: 50,
    h: 50
  }

  lightControl = new FormControl<boolean>(false);
  brightnessControl = new FormControl<number>(0);
  colorControl = new FormControl<number>(0);

  get stateClass() {
    return this.infoCommandValues().state ? 'color-light' : 'color-disabled';
  }

  override setParameterValues(values: Record<LightParamValue, string | undefined>) {
    super.setParameterValues(values);
  };

  override ngOnInit() {
    super.ngOnInit();

    this.lightControl.valueChanges
      .pipe(
        takeUntilDestroyed(this)
      )
      .subscribe((onOff) => {
        if (onOff !== null) {
          this.execToggle();
        }
      })

    this.brightnessControl.valueChanges
      .pipe(
        debounceTime(1000),
        takeUntilDestroyed(this)
      )
      .subscribe((brightness) => {
        if (brightness !== null) {
          void this.setAction('brightness', brightness);
        }
      });
    this.colorControl.valueChanges
      .pipe(
        debounceTime(1000),
        takeUntilDestroyed(this)
      )
      .subscribe((color) => {
        if (color !== null) {
          void this.setAction('color', color);
        }
      });
  }

  async setAction(action: 'brightness' | 'color', value: number) {
    await this.execUpdateSlider(action, value)
    this.infoCommandValues.set({
      ...this.infoCommandValues(),
      [action]: value,
    })
  }

  toggle() {
    if (this.isConfigMode) {
      this.openModal();
      return;
    }
    if (!this.isUserAction()) {
      return;
    }

    return this.execToggle();
  }

  execToggle() {
    this.execUpdateValue(this.infoCommandValues().state ? "off" : "on").then(_ => {
      this.infoCommandValues.set({
        ...this.infoCommandValues(),
        state: !this.infoCommandValues().state,
      })
    });
  }

  updateInfoCommandValues(values: Record<LightGlobalCommandInfo, string | number | boolean | null>) {
    this.infoCommandValues.set({
      ...this.infoCommandValues(),
      state: values.state === 1,
    })

    this.brightnessControl.setValue(this.infoCommandValues().brightness, { emitEvent: false });
    this.colorControl.setValue(this.infoCommandValues().color, { emitEvent: false });
    this.lightControl.setValue(this.infoCommandValues().state, { emitEvent: false });

    //console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues());
  }
}
