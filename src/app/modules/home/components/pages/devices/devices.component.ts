import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from "@angular/core";
import {DeviceService} from "@services";
import {DeviceCategoryEnum, DeviceConnectivityEnum, DeviceModel, DeviceTypeEnum, SmartArrayModel} from "@models";
import BaseComponent from "@base-component";


@Component({
	selector: "app-devices",
	templateUrl: "./devices.component.html",
	styleUrls: ["./devices.component.scss"],
	host: {
		class: "page-container"
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent extends BaseComponent implements OnInit, OnDestroy {
	devices: DeviceModel[] = [];
	deviceConnectivities = new SmartArrayModel<string, string>(DeviceConnectivityEnum, true);
	deviceCategories = new SmartArrayModel<string, string>(DeviceCategoryEnum, true);
	deviceTypes = new SmartArrayModel<string, string>(DeviceTypeEnum, true);
	loading = true;

	constructor(
		private deviceService: DeviceService,
	) {
		super();
	}

	async ngOnInit(): Promise<void> {
		this.deviceService.getListOrRefresh().then((devices) => {
			this.devices = devices.map((device) => {
				device.connectivityLabel = this.deviceConnectivities.get(device.connectivity);
				device.categoryLabel = this.deviceCategories.get(device.category);
				device.typeLabel = this.deviceTypes.get(device.type);
				return device;
			});
			this.loading = false;
		});
	}
}
