import {ChangeDetectionStrategy, Component} from "@angular/core";
import {DeviceMultimediaComponent, MultimediaCommandValues, MultimediaState} from "../multimedia.component";
import {
	SonosCommandAction,
	SonosCommandInfo,
	SonosConfiguration,
	SonosExtendCommandAction,
	SonosExtendCommandInfo,
	SonosGlobalCommandInfo
} from "./sonos.const";
import {FormControl} from "@angular/forms";

interface SonosCommandValues extends MultimediaCommandValues {
	state: string,
	shuffle: boolean,
	repeat: boolean,
	album: string,
}

@Component({
	selector: "app-device-sonos",
	templateUrl: "sonos.component.html",
	styleUrls: [
		"../../../base-device.component.scss",
		"../multimedia.component.scss",
		"sonos.component.scss",
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceSonosComponent
	extends DeviceMultimediaComponent<
		SonosExtendCommandInfo, SonosExtendCommandAction,
		SonosCommandValues,
		SonosCommandInfo, SonosCommandAction, SonosConfiguration
	> {
	size = {
		w: 130,
		h: 54
	};

	shuffleControl = new FormControl<boolean>(true);
	repeatControl = new FormControl<boolean>(true);

	protected override infoCommandValues: SonosCommandValues = {
		...super.infoCommandValues,
		state: "",
		shuffle: false,
		repeat: false,
		album: "",
	};

	get hasTvSound() {
		return this.infoCommandValues.title === "Entrée de ligne";
	}

	override ngOnInit() {
		super.ngOnInit();

		this.sub = this.shuffleControl.valueChanges
			.subscribe((shuffle) => {
				if (shuffle !== null) {
					void this.execUpdateValue("shuffle").then(_ => {
						this.infoCommandValues.shuffle = !shuffle;
					});
				}
			});

		this.sub = this.repeatControl.valueChanges
			.subscribe((repeat) => {
				if (repeat !== null) {
					void this.execUpdateValue("repeat").then(_ => {
						this.infoCommandValues.repeat = !repeat;
					});
				}
			});
	}

	override openModal() {
		if (this.state !== MultimediaState.offline) {
			super.openModal();
		}
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
			} else if (this.infoCommandValues.state === "") {
				this.state = MultimediaState.offline;
			}
		} else {
			this.state = MultimediaState.stopped;
		}

		this.shuffleControl.setValue(this.infoCommandValues.shuffle, {emitEvent: false});
		this.repeatControl.setValue(this.infoCommandValues.repeat, {emitEvent: false});

		//console.log(`-- [${this.name}] Updated info command values`, this.infoCommandValues);
	}
}
