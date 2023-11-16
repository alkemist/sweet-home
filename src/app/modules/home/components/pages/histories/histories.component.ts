import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import BaseComponent from "@base-component";
import { DeviceService } from '@services';
import { FormControl } from '@angular/forms';
import { DeviceCommandHistory, DeviceModel } from '@models';
import { FilterService, MenuItem } from 'primeng/api';
import { KeyValue } from '@angular/common';

@Component({
  templateUrl: "./histories.component.html",
  styleUrls: [ "./histories.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoriesComponent extends BaseComponent implements OnDestroy {
  selectedCommands = new FormControl<DeviceCommandHistory[]>([]);
  menuDevices: MenuItem[] = [];
  sidebarVisible: boolean = false;

  constructor(private deviceService: DeviceService, private filterService: FilterService) {
    super();

    this.deviceService.getListOrRefresh().then((devices) => {
      this.menuDevices = devices.map(device =>
        ({
          label: device.name,
          items: device.infoCommandIds.toKeyValues().map(item => ({
            label: item.key,
            command: () => {
              this.addDeviceCommand(device, item);
            }
          }))
        })
      )
    });
  }

  private addDeviceCommand(device: DeviceModel, command: KeyValue<string, number>) {
    this.selectedCommands.setValue([
      ...this.selectedCommands.value ?? [],
      {
        deviceName: device.name,
        commandId: command.value,
        commandName: command.key,
        history: [],
      }
    ])
  }
}
