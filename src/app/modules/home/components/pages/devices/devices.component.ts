import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceInterface, DeviceTypeEnum } from "@models";
import BaseComponent from "@base-component";
import { SmartMap } from '@alkemist/smart-tools';
import { DeviceService } from '@services';


@Component({
  templateUrl: "./devices.component.html",
  styleUrls: [ "./devices.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent extends BaseComponent implements OnInit, OnDestroy {
  devices: DeviceInterface[] = [];
  deviceConnectivities = SmartMap.fromEnum(DeviceConnectivityEnum, true);
  deviceCategories = SmartMap.fromEnum(DeviceCategoryEnum, true);
  deviceTypes = SmartMap.fromEnum(DeviceTypeEnum, true);
  loading = true;

  constructor(
    private deviceService: DeviceService,
  ) {
    super();
    void this.deviceService.checkStoreOutdated();
  }

  async ngOnInit(): Promise<void> {
    this.devices = this.deviceService.items().map((device) => {
      device.connectivityLabel = this.deviceConnectivities.get(device.connectivity!);
      device.categoryLabel = this.deviceCategories.get(device.category);
      device.typeLabel = this.deviceTypes.get(device.type);
      return device;
    });
    this.loading = false;

    /*this.deviceService.getListOrRefresh().then((devices) => {
      this.devices = devices.map((device) => {
        device.connectivityLabel = this.deviceConnectivities.get(device.connectivity!);
        device.categoryLabel = this.deviceCategories.get(device.category);
        device.typeLabel = this.deviceTypes.get(device.type);
        return device;
      });
      this.loading = false;
    });*/
  }
}
