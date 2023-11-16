import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, FilterService, MessageService } from "primeng/api";
import { AppService, DeviceService } from "@services";
import { KeyValue } from "@angular/common";
import {
  CoordinateFormInterface,
  DeviceCategoryEnum,
  DeviceConnectivityEnum,
  DeviceFormInterface,
  DeviceFrontInterface,
  DeviceModel,
  DeviceTypeEnum,
  JeedomDeviceModel,
  JeedomRoomModel,
  KeyValueFormInterface,
} from "@models";
import BaseComponent from "@base-component";
import { ComponentClassByType, deviceConfigurations } from "@devices";
import { ArrayHelper, ConsoleHelper, ObjectHelper, SmartMap, StringHelper } from '@alkemist/smart-tools';

@Component({
  templateUrl: "./device.component.html",
  styleUrls: [ "./device.component.scss" ],
  host: {
    class: "page-container"
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeviceComponent extends BaseComponent implements OnInit, OnDestroy {
  device: DeviceModel | null = null;
  deviceConnectivities = ArrayHelper.enumToArray(DeviceConnectivityEnum);
  deviceCategories = ArrayHelper.enumToArray(DeviceCategoryEnum);
  deviceTypes = ArrayHelper.enumToArray(DeviceTypeEnum);
  currentDeviceTypes: KeyValue<string, string>[] = [];

  form: FormGroup<DeviceFormInterface> = new FormGroup<DeviceFormInterface>({
    id: new FormControl<string | null | undefined>(""),
    connectivity: new FormControl<DeviceConnectivityEnum | null>(null, [ Validators.required ]),
    category: new FormControl<DeviceCategoryEnum | null>(null, [ Validators.required ]),
    type: new FormControl<DeviceTypeEnum | null>(null, [ Validators.required ]),
    name: new FormControl<string>("", [ Validators.required ]),
    jeedomId: new FormControl<number | null>(null, [ Validators.required ]),
    position: new FormGroup<CoordinateFormInterface>({
      x: new FormControl<number | null>(10, [ Validators.required ]),
      y: new FormControl<number | null>(10, [ Validators.required ]),
    }),
    infoCommandIds: new FormArray<FormGroup<KeyValueFormInterface<number>>>([]),
    actionCommandIds: new FormArray<FormGroup<KeyValueFormInterface<number>>>([]),
    configurationValues: new FormArray<FormGroup<KeyValueFormInterface<string>>>([]),
    parameterValues: new FormArray<FormGroup<KeyValueFormInterface<string>>>([]),
  });
  loading = true;
  error: string = "";
  importDeviceControl = new FormControl<JeedomDeviceModel | string | null>(null);
  jeedomRooms: JeedomRoomModel[] = [];
  filteredJeedomRooms = signal<JeedomRoomModel[]>([]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private routerService: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private appService: AppService,
    private filterService: FilterService
  ) {
    super();
    this.sub = this.category.valueChanges.subscribe((category) => {
      if (category !== null && ComponentClassByType[category]) {
        this.currentDeviceTypes = Object.keys(ComponentClassByType[category]).map((key) =>
          this.deviceTypes.find((kv => kv.key === key)
          ) as KeyValue<string, string>);
      }
    });

    this.sub = this.importDeviceControl.valueChanges.subscribe((jeedomDevice) => {
      if (jeedomDevice && jeedomDevice instanceof JeedomDeviceModel
        && this.connectivity.value && this.category.value && this.type.value) {

        this.jeedomId.setValue(jeedomDevice.id);
        if (!this.name.value) {
          this.name.setValue(jeedomDevice.name);
        }

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

        this.importDeviceControl.setValue("", { emitEvent: false });
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

  get position() {
    return this.form.controls.position;
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
        if (data && data["device"]) {
          this.device = data["device"] as DeviceModel;
          this.appService.setSubTitle(this.device.name);

          this.device.infoCommandIds.forEach(() => this.addInfoCommand());
          this.device.actionCommandIds.forEach(() => this.addActionCommand());
          this.device.configurationValues.forEach(() => this.addConfigurationValue());
          this.device.parameterValues.forEach(() => this.addParameterValue());

          this.form.setValue(this.device.toForm());
        } else {
          this.appService.setSubTitle();
        }

        this.loading = false;
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

    if (this.form.valid) {
      const formData = this.form.value as DeviceFrontInterface;
      const checkExist = !this.device || StringHelper.slugify(formData.name) !== StringHelper.slugify(this.device.name);

      if (checkExist) {
        this.deviceService.exist(formData.name).then(async exist => {
          if (exist) {
            return this.name.setErrors({ "exist": true });
          }
          await this.submit(formData);
        });
      } else {
        await this.submit(formData);
      }
    }
  }

  async submit(formData: DeviceFrontInterface): Promise<void> {
    this.loading = true;
    const device = DeviceModel.importFormData(formData);

    if (this.device) {
      this.deviceService.update(device).then(async _ => {
        this.device = device;
        this.loading = false;
        this.messageService.add({
          severity: "success",
          detail: $localize`Device updated`
        });
        await this.routerService.navigate([ "../" ], { relativeTo: this.activatedRoute });
      });
    } else {
      await this.deviceService.add(device).then(async _ => {
        this.device = device;
        this.loading = false;
        this.messageService.add({
          severity: "success",
          detail: $localize`Device added`,
        });
        await this.routerService.navigate([ "../" ], { relativeTo: this.activatedRoute });
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: "device",
      message: $localize`Are you sure you want to delete it ?`,
      accept: () => {
        this.loading = true;
        this.deviceService.remove(this.device!).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: "success",
            detail: $localize`Device deleted`
          });
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
