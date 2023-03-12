import { Component, OnInit } from '@angular/core';
import { DeviceModel } from '@app/models/device.model';
import { DeviceService } from '@app/services/device.service';
import { DeviceCategoryEnum } from '@models';
import { SmartArrayModel } from '@app/models/smart-array.model';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: [ './devices.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class DevicesComponent implements OnInit {
  devices: DeviceModel[] = [];
  deviceCategoriesIterable = new SmartArrayModel<string, string>(DeviceCategoryEnum, true);
  loading = true;

  constructor(
    private deviceService: DeviceService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices.map((device) => {
        device.categoryLabel = this.deviceCategoriesIterable.get(device.category);
        return device;
      });
      this.loading = false;
    });
  }
}
