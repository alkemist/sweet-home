import { ChangeDetectionStrategy, Component, signal, WritableSignal } from "@angular/core";
import { DeviceMultimediaComponent } from "../../multimedia.component";
import {
  ChromecastCommandAction,
  ChromecastExtendCommandAction,
  ChromecastExtendCommandInfo,
  ChromecastExtendParamValue,
  ChromecastGlobalCommandInfo
} from './chromecast.type';
import { ChromecastCommandValues, ChromecastParameterValues } from './chromecast.interface';
import { MultimediaState } from '../../multimedia.enum';


@Component({
  selector: "app-device-chromecast",
  templateUrl: "chromecast.component.html",
  styleUrls: [
    "../../../../base-device.component.scss",
    "../../multimedia.component.scss",
    "chromecast.component.scss",
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceChromecastComponent extends DeviceMultimediaComponent<
  ChromecastExtendCommandInfo,
  ChromecastExtendCommandAction,
  ChromecastGlobalCommandInfo,
  ChromecastCommandAction,
  never,
  ChromecastCommandValues,
  ChromecastExtendParamValue,
  ChromecastParameterValues
> {
  size = {
    w: 130,
    h: 54
  };

  override infoCommandValues: WritableSignal<ChromecastCommandValues> = signal<ChromecastCommandValues>({
    ...super.infoCommandSignalValues,
    online: false,
    player: "",
    display: "",
  });

  get isBackdrop(): boolean {
    return this.infoCommandValues().display === "Backdrop";
  }

  get application(): string {
    const application = this.infoCommandValues().display ?? "";
    if (this.isBackdrop) {
      return "";
    }
    return application.toString();
  }

  get stopDisabled() {
    return this.application === "Netflix";
  }

  override ngOnInit() {
    super.ngOnInit();
  }

  back(): Promise<void> {
    return this.execUpdateValue("back");
  }

  async unCast(): Promise<void> {
    await this.execUpdateValue("backdrop");
    this.updateInfoCommandValue('display', "Backdrop");
  }

  override openModal() {
    if ((!this.parameterValues.disableVolume || this.application) && this.state !== MultimediaState.offline) {
      super.openModal();
    }
  }

  override updateInfoCommandValues(values: Record<ChromecastGlobalCommandInfo, string | number | boolean | null>) {
    super.updateInfoCommandValues(values);

    this.updateInfoCommandValue('online', values.online === 1);

    if (!this.infoCommandValues().online) {
      this.state = MultimediaState.offline;
    } else if (this.infoCommandValues().player === "PLAYING") {
      this.state = MultimediaState.playing;
    } else if (this.infoCommandValues().player === "PAUSED") {
      this.state = MultimediaState.paused;
    } else {
      this.state = MultimediaState.stopped;
    }

    //console.log(`-- [${this.name}] Updated info command values`, this.infoCommandValues(),);
  }
}
