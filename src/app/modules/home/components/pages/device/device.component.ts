import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjectHelper, slugify } from '@tools';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { AppService, DeviceService } from '@services';
import {
  ComponentClassByType,
  CoordinateFormInterface,
  DeviceCategoryEnum,
  DeviceFormInterface,
  DeviceFrontInterface,
  DeviceModel,
  DeviceTypeEnum,
  KeyValueFormInterface,
  SmartArrayModel,
  TypesByCategory
} from '@models';
import { KeyValue } from '@angular/common';
import { JeedomDeviceModel } from '../../../../../models/jeedom-device.model';
import { BaseComponent } from '../../../../../components/base.component';
import { JeedomRoomModel } from '../../../../../models/jeedom-room.model';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: [ './device.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class DeviceComponent extends BaseComponent implements OnInit {
  device: DeviceModel | null = null;
  deviceCategoriesIterable = new SmartArrayModel<string, string>(DeviceCategoryEnum, true);
  deviceTypesIterable = new SmartArrayModel<string, string>(DeviceTypeEnum, true);
  deviceTypes: KeyValue<string, string>[] = [];

  form: FormGroup<DeviceFormInterface> = new FormGroup<DeviceFormInterface>({
    id: new FormControl<string | null | undefined>(''),
    jeedomId: new FormControl<number | null>(null, [ Validators.required ]),
    name: new FormControl<string>('', [ Validators.required ]),
    category: new FormControl<DeviceCategoryEnum | null>(null, [ Validators.required ]),
    type: new FormControl<DeviceTypeEnum | null>(null, [ Validators.required ]),
    position: new FormGroup<CoordinateFormInterface>({
      x: new FormControl<number | null>(null, [ Validators.required ]),
      y: new FormControl<number | null>(null, [ Validators.required ]),
    }),
    commands: new FormArray<FormGroup<KeyValueFormInterface>>([])
  })
  loading = true;
  error: string = '';
  importDeviceControl = new FormControl<JeedomDeviceModel | string | null>(null);
  jeedomRooms: JeedomRoomModel[] = [];
  filteredJeedomRooms: JeedomRoomModel[] = [];

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
      if (category !== null) {
        this.deviceTypes = TypesByCategory[category].map((key) => {
          return {
            key,
            value: this.deviceTypesIterable.get(key)
          } as KeyValue<string, string>;
        })
      }
    })
    this.sub = this.importDeviceControl.valueChanges.subscribe((jeedomDevice) => {
      if (jeedomDevice && jeedomDevice instanceof JeedomDeviceModel && this.type.value) {
        this.jeedomId.setValue(jeedomDevice.id);
        this.commands.clear();

        const availableCommands = ComponentClassByType[this.type.value].class.availableCommands;
        const deviceCommands: Record<string, string>[] = jeedomDevice.commands
          .map(command => ObjectHelper.objectToRecord<string>(command));

        Object.entries(availableCommands).forEach(([ commandId, commandFilter ]) => {
          const command = deviceCommands.find((command) => {
            return Object.entries(commandFilter).every(([ key, value ]) => command[key] === value);
          })

          if (command) {
            this.addCommand({ key: commandId, value: parseInt(command['id'], 10) })
          }
        });
      }
    })
  }

  get name() {
    return this.form.controls.name;
  }

  get category() {
    return this.form.controls.category;
  }

  get jeedomId() {
    return this.form.controls.jeedomId as FormControl<number>;
  }

  get type() {
    return this.form.controls.type;
  }

  get position() {
    return this.form.controls.position;
  }

  get commands() {
    return this.form.controls.commands;
  }

  override async ngOnInit(): Promise<void> {
    this.loadData();
  }

  loadData() {
    this.activatedRoute.data.subscribe(
      ((data) => {
        if (data && data['device']) {
          this.device = data['device'] as DeviceModel;
          this.appService.setSubTitle(this.device.name);

          this.device.commands.forEach(() => this.addCommand());
          this.form.setValue(this.device.toForm())
        } else {
          this.appService.setSubTitle();
        }

        this.loading = false;
      }));
  }

  addCommand(keyValue?: KeyValue<string, number>) {
    this.commands.push(new FormGroup({
      key: new FormControl<string | null>(keyValue?.key ?? null, [ Validators.required ]),
      value: new FormControl<number | null>(keyValue?.value ?? null, [ Validators.required ]),
    }))
  }

  async handleSubmit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const formData = this.form.value as DeviceFrontInterface
      const checkExist = !this.device || slugify(formData.name) !== slugify(this.device.name);

      if (checkExist) {
        this.deviceService.exist(formData.name).then(async exist => {
          if (exist) {
            return this.name.setErrors({ 'exist': true });
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
      this.deviceService.update(device).then(async (deviceUpdated) => {
        this.device = device;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: $localize`Device updated`
        });
        await this.routerService.navigate([ '../', deviceUpdated.slug ], { relativeTo: this.activatedRoute });
      });
    } else {
      await this.deviceService.add(device).then(async (deviceUpdated) => {
        this.device = device;
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          detail: $localize`Device added`,
        });
        await this.routerService.navigate([ '../', deviceUpdated.slug ], { relativeTo: this.activatedRoute });
      });
    }
  }

  async remove(): Promise<void> {
    this.confirmationService.confirm({
      key: 'device',
      message: $localize`Are you sure you want to delete it ?`,
      accept: () => {
        this.loading = true;
        this.deviceService.remove(this.device!).then(async () => {
          this.loading = false;
          this.messageService.add({
            severity: 'success',
            detail: $localize`Device deleted`
          });
          await this.routerService.navigate([ '../' ], { relativeTo: this.activatedRoute });
        });
      }
    });
  }

  removeCommand(i: number) {
    this.commands.removeAt(i);
  }

  async filterJeedomDevices(event: { query: string }) {
    if (this.jeedomRooms.length === 0) {
      this.jeedomRooms = await this.deviceService.availableDevices();
    }
    this.filteredJeedomRooms = [];
    this.jeedomRooms.forEach((room) => {
      const filteredDevices: JeedomDeviceModel[] =
        this.filterService.filter(room.devices, [ 'name', 'id' ], event.query, "contains");

      if (filteredDevices.length > 0) {
        this.filteredJeedomRooms.push(
          new JeedomRoomModel(room.id, room.name, filteredDevices)
        )
      }
    });
  }

  discoverCommands() {
    if (this.device && this.type.value) {

    }
  }
}
