import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, WritableSignal } from "@angular/core";
import { DeviceBackInterface, DeviceCategoryEnum, DeviceConnectivityEnum, DeviceModel, DeviceTypeEnum } from "@models";
import BaseComponent from "@base-component";
import { SmartMap } from '@alkemist/smart-tools';
import { DeviceService } from '@services';
import { DeviceState } from "@stores";
import { Observe } from '@alkemist/ngx-state-manager';


@Component({
  templateUrl: "./devices.component.html",
  styleUrls: [ "./devices.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevicesComponent extends BaseComponent implements OnInit, OnDestroy {
  deviceConnectivities = SmartMap.fromEnum(DeviceConnectivityEnum, true);
  deviceCategories = SmartMap.fromEnum(DeviceCategoryEnum, true);
  deviceTypes = SmartMap.fromEnum(DeviceTypeEnum, true);
  loading = true;
  maxRows = 100;

  @Observe(DeviceState, DeviceState.items)
  protected _items!: WritableSignal<DeviceBackInterface[]>;
  protected devices = computed(
    () => this._items().map(_item => {
      const device = new DeviceModel(_item);
      device.connectivityLabel = this.deviceConnectivities.get(device.connectivity!);
      device.categoryLabel = this.deviceCategories.get(device.category);
      device.typeLabel = this.deviceTypes.get(device.type);
      return device;
    })
  )

  constructor(
    private deviceService: DeviceService,
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    await this.deviceService.checkStoreOutdated();
    this.loading = false;
  }
}
