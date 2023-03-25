import { Component, OnDestroy, OnInit } from '@angular/core';
import { DeviceCategoryEnum, DeviceModel, DeviceTypeEnum, SmartArrayModel } from '@models';
import { DeviceService } from '@services';
import { BaseComponent } from '../../../../../components/base.component';


@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [ './devices.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class DevicesComponent extends BaseComponent implements OnInit, OnDestroy {
  devices: DeviceModel[] = [];
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
        device.categoryLabel = this.deviceCategories.get(device.category);
        device.typeLabel = this.deviceTypes.get(device.type);
        return device;
      });
      this.loading = false;
    });
  }
}
