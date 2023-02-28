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
  deviceCategories = EnumHelper.enumToObject(DeviceCategoryEnum);
  loading = true;

  constructor(
    private deviceService: DeviceService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.deviceService.getAll().then(devices => {
      this.devices = devices;
      this.loading = false;
    });
  }
}
