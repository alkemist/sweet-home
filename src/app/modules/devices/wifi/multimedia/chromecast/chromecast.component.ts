import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceMultimediaComponent, MultimediaCommandValues, MultimediaParameterValues, MultimediaState} from "../multimedia.component";
import {
	ChromecastCommandAction,
	ChromecastCommandInfo,
	ChromecastExtendCommandAction,
	ChromecastExtendCommandInfo,
	ChromecastExtendParamValue,
	ChromecastGlobalCommandInfo
} from "./chromecast.const";

interface ChromecastCommandValues extends MultimediaCommandValues {
	online: boolean,
	player: string,
	display: string,
}

export interface ChromecastParameterValues extends MultimediaParameterValues {
	disableVolume: boolean,
}

@Component({
	selector: "app-device-chromecast",
	templateUrl: "chromecast.component.html",
	styleUrls: [
		"../../../base-device.component.scss",
		"../multimedia.component.scss",
		"chromecast.component.scss",
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceChromecastComponent extends DeviceMultimediaComponent<
	ChromecastExtendCommandInfo, ChromecastExtendCommandAction,
	ChromecastCommandValues,
	ChromecastCommandInfo, ChromecastCommandAction, string,
	ChromecastExtendParamValue, ChromecastParameterValues
> {
	size = {
		w: 130,
		h: 54
	};

	override infoCommandValues: ChromecastCommandValues = {
		...super.infoCommandValues,
		online: false,
		player: "",
		display: "",
	};

	get isBackdrop(): boolean {
		return this.infoCommandValues.display === "Backdrop";
	}

	get application(): string {
		const application = this.infoCommandValues.display ?? "";
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

	unCast(): Promise<void> {
		return this.execUpdateValue("backdrop").then(_ => {
			this.infoCommandValues.display = "Backdrop";
		});
	}

	override openModal() {
		if ((!this.parameterValues.disableVolume || this.application) && this.state !== MultimediaState.offline) {
			super.openModal();
		}
	}

	override updateInfoCommandValues(values: Record<ChromecastGlobalCommandInfo, string | number | boolean | null>) {
		super.updateInfoCommandValues(values);

		this.infoCommandValues.online = values.online === 1;

		if (!this.infoCommandValues.online) {
			this.state = MultimediaState.offline;
		} else if (this.infoCommandValues.player === "PLAYING") {
			this.state = MultimediaState.playing;
		} else if (this.infoCommandValues.player === "PAUSED") {
			this.state = MultimediaState.paused;
		} else {
			this.state = MultimediaState.stopped;
		}

		console.log(`-- [${this.name}] Updated info command values`, this.infoCommandValues,);
	}
}
