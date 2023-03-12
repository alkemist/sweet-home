import { Component, OnInit } from '@angular/core';
import { DeviceModel } from '@app/models/device.model';
import { DeviceService } from '@app/services/device.service';
import { EnumHelper } from '@tools';
import { DeviceCategoryEnum } from '@models';

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
  deviceCategoriesArray;
  deviceCategoriesObject;
  loading = true;

  constructor(
    private deviceService: DeviceService,
  ) {
    this.deviceCategoriesArray = EnumHelper.enumToArray(DeviceCategoryEnum);
    this.deviceCategoriesObject = EnumHelper.arrayToObject(this.deviceCategoriesArray);
  }

  async ngOnInit(): Promise<void> {
    this.deviceService.getListOrRefresh().then(devices => {
      this.devices = devices.map((device) => {
        device.categoryLabel = this.deviceCategoriesObject[device.category];
        return device;
      });
      this.loading = false;
    });
  }
}
