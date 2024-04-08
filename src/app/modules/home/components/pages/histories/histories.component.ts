import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, WritableSignal } from "@angular/core";
import BaseComponent from "@base-component";
import { DeviceService } from '@services';
import { FormControl } from '@angular/forms';
import { DeviceBackInterface, DeviceCommandHistory, DeviceModel } from '@models';
import { MenuItem } from 'primeng/api';
import { KeyValue, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChipsRemoveEvent } from 'primeng/chips';
import { Observe } from '@alkemist/ngx-state-manager';
import { DeviceState } from '@stores';

@Component({
  templateUrl: "./histories.component.html",
  styleUrls: [ "./histories.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoriesComponent extends BaseComponent implements OnInit, OnDestroy {
  selectedCommands = new FormControl<DeviceCommandHistory[]>([]);
  menuDevices: MenuItem[] = [];
  sidebarVisible: boolean = false;
  dates: string[] = [];
  @Observe(DeviceState, DeviceState.items)
  protected _items!: WritableSignal<DeviceBackInterface[]>;
  protected devices = computed(
    () => this._items().map(_item => new DeviceModel(_item))
  )
  private commandIds: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private deviceService: DeviceService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams
      .subscribe((queryParams: Record<string, any>) => {
        this.commandIds = queryParams['commandIds'] ?? [];
        this.dates = queryParams['dates'] ?? [];

        this.updateMenu();

        if (this.commandIds.length > 0) {
          const commands: DeviceCommandHistory[] = [];

          this.devices().forEach((device) => {
            device.infoCommandIds.toKeyValues().forEach((command) => {
              if (this.commandIds.includes(command.value.toString())) {
                commands.push({
                  deviceName: device.name,
                  commandId: command.value,
                  commandName: command.key,
                  history: [],
                });
              }
            })
          });

          if (commands.length > 0) {
            this.selectedCommands.setValue(commands);
          }
        }
      });
  }

  updateUrl() {
    this.location.go(this.router.createUrlTree(
      [], {
        relativeTo: this.route,
        queryParams: {
          commandIds: this.commandIds,
          dates: this.dates
        }
      })
      .toString());
  }

  updateMenu() {
    this.menuDevices = this.devices().map(device =>
      ({
        label: device.name,
        items: device.infoCommandIds.toKeyValues().map(command => ({
          label: command.key,
          disabled: this.commandIds.includes(command.value.toString()),
          command: () => {
            this.addDeviceCommand(device, command);
          }
        })).sort((i1, i2) => i1.label.localeCompare(i2.label))
      })
    ).sort((i1, i2) => i1.label.localeCompare(i2.label));
  }

  removeDeviceCommand($event: ChipsRemoveEvent) {
    const removedCommand = $event.value;

    const currentCommands = this.selectedCommands.value ?? [];

    const selectedCommands = currentCommands.filter(command =>
      command.commandId !== removedCommand.commandId
    )

    this.commandIds = selectedCommands.map(command => command.commandId.toString())

    this.updateUrl()
    this.updateMenu();

    this.selectedCommands.setValue(selectedCommands);
  }

  datesChange(dates: Date[]) {
    this.dates = dates.map(date => date.getTime().toString());
    this.updateUrl()
  }

  private addDeviceCommand(device: DeviceModel, command: KeyValue<string, number>) {
    const currentCommands = this.selectedCommands.value ?? [];

    this.commandIds = [
      ...currentCommands.map(command => command.commandId.toString()),
      command.value.toString()
    ];

    this.updateUrl()
    this.updateMenu();

    this.selectedCommands.setValue([
      ...currentCommands,
      {
        deviceName: device.name,
        commandId: command.value,
        commandName: command.key,
        history: [],
      }
    ])
  }
}
