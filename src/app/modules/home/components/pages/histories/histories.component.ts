import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import BaseComponent from "@base-component";
import { DeviceService } from '@services';
import { FormControl } from '@angular/forms';
import { DeviceCommandHistory, DeviceModel } from '@models';
import { FilterService } from 'primeng/api';

@Component({
  templateUrl: "./histories.component.html",
  styleUrls: [ "./histories.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoriesComponent extends BaseComponent implements OnInit, OnDestroy {
  devices: DeviceModel[] = [];
  deviceSelected: DeviceModel | null = null;
  filteredDevices = signal<DeviceModel[]>([]);
  commands: any[] = [];
  deviceCommands: DeviceCommandHistory[] = [];

  deviceControl = new FormControl<DeviceModel | string | null>(null);
  commandControl = new FormControl<string | null>(null);

  constructor(private deviceService: DeviceService, private filterService: FilterService) {
    super();

    this.deviceService.getListOrRefresh().then((devices) => {
      console.log('devices', devices);
      this.devices = devices;
      this.filteredDevices.set(devices);
    });

    this.sub = this.deviceControl.valueChanges.subscribe((device) => {
      this.commandControl.setValue(null, { emitEvent: false });
      this.commands = [];
      if (device && typeof device !== 'string') {
        console.log("device", device, device.infoCommandIds);
        //this.commands = device.infoCommandIds.keys() as string[];
      }
    })

    this.sub = this.commandControl.valueChanges.subscribe((commandName) => {
      if (commandName && this.deviceControl.value && typeof this.deviceControl.value !== 'string') {
        console.log("command", commandName);
        this.addDeviceCommand(this.deviceControl.value, commandName)
        this.commandControl.setValue(null, { emitEvent: false })
      }
    })
  }

  ngOnInit() {

  }

  addDeviceCommand(device: DeviceModel, commandName: string) {
    this.deviceCommands.push({
      deviceName: device.name,
      commandId: device.infoCommandIds.get(commandName),
      commandName: commandName,
      history: [],
    })
  }

  filterDevices(event: { query: string }) {
    this.filteredDevices.set(
      this.filterService.filter(this.devices, [ "name", "id" ], event.query, "contains")
    );
  }
}
