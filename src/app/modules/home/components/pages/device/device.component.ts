import { ChangeDetectionStrategy, Component, computed, OnDestroy, OnInit, signal, WritableSignal } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, FilterService } from "primeng/api";
import { AppService, DeviceService } from "@services";
import { KeyValue } from "@angular/common";
import {
  DeviceCategoryEnum,
  DeviceConnectivityEnum,
  DeviceFormInterface,
  DeviceFrontInterface,
  DeviceModel,
  DeviceModelInterface,
  DeviceTypeEnum,
  JeedomDeviceModel,
  JeedomRoomModel,
  KeyValueFormInterface,
} from "@models";
import BaseComponent from "@base-component";
import { ComponentClassByType, deviceConfigurations } from "@devices";
import { ArrayHelper, ConsoleHelper, ObjectHelper, SmartMap } from '@alkemist/smart-tools';
import { Observe } from '@alkemist/ngx-state-manager';
import { DeviceState } from '@stores';

@Component({
  templateUrl: "./device.component.html",
  styleUrls: [ "./device.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceComponent extends BaseComponent implements OnInit, OnDestroy {
  deviceConnectivities = ArrayHelper.enumToArray(DeviceConnectivityEnum, true);
  deviceCategories = ArrayHelper.enumToArray(DeviceCategoryEnum, true);
  deviceTypes = ArrayHelper.enumToArray(DeviceTypeEnum, true);
  currentDeviceTypes: KeyValue<string, string>[] = [];

  form: FormGroup<DeviceFormInterface> = new FormGroup<DeviceFormInterface>({
    id: new FormControl<string | null>(null, []),
    connectivity: new FormControl<DeviceConnectivityEnum | null>(null, [ Validators.required ]),
    category: new FormControl<DeviceCategoryEnum | null>(null, [ Validators.required ]),
    type: new FormControl<DeviceTypeEnum | null>(null, [ Validators.required ]),
    name: new FormControl<string>("", [ Validators.required ]),
    jeedomId: new FormControl<number | null>(null, [ Validators.required ]),
    positionX: new FormControl<number | null>(10, [ Validators.required ]),
    positionY: new FormControl<number | null>(10, [ Validators.required ]),
    infoCommandIds: new FormArray<FormGroup<KeyValueFormInterface<number>>>([]),
    actionCommandIds: new FormArray<FormGroup<KeyValueFormInterface<number>>>([]),
    configurationValues: new FormArray<FormGroup<KeyValueFormInterface<string>>>([]),
    parameterValues: new FormArray<FormGroup<KeyValueFormInterface<string>>>([]),
  });
  loading = signal(true);
  error: string = "";
  importDeviceControl = new FormControl<JeedomDeviceModel | string | null>(null);
  jeedomRooms: JeedomRoomModel[] = [];
  filteredJeedomRooms = signal<JeedomRoomModel[]>([]);

  @Observe(DeviceState, DeviceState.item)
  protected _item!: WritableSignal<DeviceFrontInterface | null>;
  device = computed(
    () =>
      this._item() !== null
        ? new DeviceModel(this._item()!)
        : null
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private routerService: Router,
    private confirmationService: ConfirmationService,
    private appService: AppService,
    private filterService: FilterService
  ) {
    super();

    this.sub = this.category.valueChanges.subscribe((category) => {

      if (category !== null) {
        if (ComponentClassByType[category as DeviceCategoryEnum]) {
          this.currentDeviceTypes = Object.keys(ComponentClassByType[category as DeviceCategoryEnum]).map((key) =>
            this.deviceTypes.find((kv => kv.key === key)
            ) as KeyValue<string, string>);
        }
      }
    });

    this.sub = this.importDeviceControl.valueChanges.subscribe((jeedomDevice) => {
      if (jeedomDevice && jeedomDevice instanceof JeedomDeviceModel
        && this.connectivity.value && this.category.value && this.type.value) {

        this.importDeviceControl.setValue("", { emitEvent: false });

        this.jeedomId.setValue(jeedomDevice.id);
        this.name.setValue(jeedomDevice.name);

        this.infoCommandIds.clear();
        this.actionCommandIds.clear();
        this.configurationValues.clear();

        const parameterValues = SmartMap.fromKeyValues(this.parameterValues.value as KeyValue<string, string>[]);
        this.parameterValues.clear();

        const deviceCommands: Record<string, string>[] = jeedomDevice.commands
          .map(command => ObjectHelper.objectToRecord<string>(command));

        const configurations = deviceConfigurations[this.connectivity.value]![this.category.value]![this.type.value];

        if (configurations) {
          Object.entries(configurations.infoCommandFilters).forEach(([ commandId, commandFilter ]) => {
            const command = deviceCommands.find((command) => {
              return Object.entries(commandFilter).every(([ key, value ]) => command[key] === value);
            });

            if (command) {
              this.addInfoCommand({ key: commandId, value: parseInt(command["id"], 10) });
            }
          });

          Object.entries(configurations.actionCommandFilters).forEach(([ commandId, commandFilter ]) => {
            const command = deviceCommands.find((command) => {
              return Object.entries(commandFilter).every(([ key, value ]) => command[key] === value);
            });

            if (command) {
              this.addActionCommand({ key: commandId, value: parseInt(command["id"], 10) });
            }
          });

          Object.entries(configurations.configurationFilters).forEach(([ configurationId, commandFilter ]) => {
            const value = jeedomDevice.values[commandFilter];

            if (value) {
              this.addConfigurationValue({ key: configurationId, value: value });
            }
          });

          configurations.customParameters.forEach((paramName) => {
            this.addParameterValue({ key: paramName, value: parameterValues.get(paramName) ?? "" });
          });

          ConsoleHelper.group(`[${ jeedomDevice.id }][${ jeedomDevice.name }]`, [
            jeedomDevice
          ])
        }
      }
    });
  }

  get connectivity() {
    return this.form.controls.connectivity;
  }

  get category() {
    return this.form.controls.category;
  }

  get type() {
    return this.form.controls.type;
  }

  get name() {
    return this.form.controls.name;
  }

  get jeedomId() {
    return this.form.controls.jeedomId as FormControl<number>;
  }

  get positionX() {
    return this.form.controls.positionX;
  }

  get positionY() {
    return this.form.controls.positionY;
  }

  get configurationValues() {
    return this.form.controls.configurationValues;
  }

  get parameterValues() {
    return this.form.controls.parameterValues;
  }

  get infoCommandIds() {
    return this.form.controls.infoCommandIds;
  }

  get actionCommandIds() {
    return this.form.controls.actionCommandIds;
  }

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  loadData() {
    this.sub = this.activatedRoute.data.subscribe(
      ((data) => {
        if (data['device']) {
          this.appService.setSubTitle(this.device()!.name);

          this.device()!.infoCommandIds.forEach(() => this.addInfoCommand());
          this.device()!.actionCommandIds.forEach(() => this.addActionCommand());
          this.device()!.configurationValues.forEach(() => this.addConfigurationValue());
          this.device()!.parameterValues.forEach(() => this.addParameterValue());

          this.form.setValue(this.device()!.toForm());
        } else {
          void this.deviceService.dispatchReset();
          this.appService.setSubTitle();
        }

        this.loading.set(false);
      }));
  }

  addParameterValue(keyValue?: KeyValue<string, string>) {
    this.parameterValues.push(
      this.addCommandForm(keyValue)
    );
  }

  addInfoCommand(keyValue?: KeyValue<string, number>) {
    this.infoCommandIds.push(
      this.addCommandForm(keyValue)
    );
  }

  addActionCommand(keyValue?: KeyValue<string, number>) {
    this.actionCommandIds.push(
      this.addCommandForm(keyValue)
    );
  }

  addConfigurationValue(keyValue?: KeyValue<string, string>) {
    this.configurationValues.push(
      this.addCommandForm(keyValue)
    );
  }

  addCommandForm<T>(keyValue?: KeyValue<string, T>) {
    return new FormGroup({
      key: new FormControl<string | null>(keyValue?.key ?? null, [ Validators.required ]),
      value: new FormControl<T | null>(keyValue?.value ?? null),
    });
  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    console.log(this.form.valid);
    console.log(this.form.value);
    if (this.form.valid) {
      const formData = this.form.value as DeviceModelInterface;
      const device = DeviceModel.importFormData(formData);

      if (!await this.deviceService.exist(
        device,
        this.device() ? this.device()!.id : undefined
      )) {
        void this.submit(device);
      }
    }
  }

  async submit(device: DeviceModel): Promise<void> {
    this.loading.set(true);

    if (this.device()) {
      this.deviceService.update(device.id, device).then(_ => {
        this.loading.set(false);
        void this.routerService.navigate([ "../" ], { relativeTo: this.activatedRoute });
      })
    } else {
      this.deviceService.add(device).then(_ => {
        this.loading.set(false);
        void this.routerService.navigate([ "../" ], { relativeTo: this.activatedRoute });
      })
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "device",
      message: $localize`Are you sure you want to delete it ?`,
      accept: () => {
        this.loading.set(true);
        this.deviceService.delete(this.device()!).then(async () => {
          this.loading.set(false);
          await this.routerService.navigate([ "../" ], { relativeTo: this.activatedRoute });
        });
      }
    });
  }

  async filterJeedomDevices(event: {
    query: string
  }) {
    if (this.jeedomRooms.length === 0) {
      this.jeedomRooms = await this.deviceService.availableDevices();
    }
    const filteredJeedomRooms: JeedomRoomModel[] = [];
    this.jeedomRooms.forEach((room) => {
      const filteredDevices: JeedomDeviceModel[] =
        this.filterService.filter(room.devices, [ "name", "id" ], event.query, "contains");

      if (filteredDevices.length > 0) {
        filteredJeedomRooms.push(
          new JeedomRoomModel(room.id, room.name, filteredDevices)
        );
      }
    });
    this.filteredJeedomRooms.set(filteredJeedomRooms);
  }
}
