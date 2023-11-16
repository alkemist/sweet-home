import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { DeviceService } from "@services";
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceModel, DeviceTypeEnum } from "@models";
import BaseComponent from "@base-component";
import { SmartMap } from '@alkemist/smart-tools';


@Component({
  templateUrl: "./devices.component.html",
  styleUrls: [ "./devices.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent extends BaseComponent implements OnInit, OnDestroy {
  devices: DeviceModel[] = [];
  deviceConnectivities = SmartMap.fromEnum(DeviceConnectivityEnum);
  deviceCategories = SmartMap.fromEnum(DeviceCategoryEnum);
  deviceTypes = SmartMap.fromEnum(DeviceTypeEnum);
  loading = true;

  constructor(
    private deviceService: DeviceService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    this.deviceService.getListOrRefresh().then((devices) => {
      this.devices = devices.map((device) => {
        device.connectivityLabel = this.deviceConnectivities.get(device.connectivity!);
        device.categoryLabel = this.deviceCategories.get(device.category);
        device.typeLabel = this.deviceTypes.get(device.type);
        return device;
      });
      this.loading = false;
    });
  }
}
