import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumHelper, slugify } from '@tools';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DeviceService } from '@services';
import {
  CoordinateFormInterface,
  DeviceBackInterface,
  DeviceCategoryEnum,
  DeviceFormInterface,
  DeviceFrontInterface,
  DeviceModel,
  DeviceTypeEnum,
  KeyValueFormInterface
} from '@models';
import { AppService } from '@app/services/app.service';
import { HasIdWithInterface } from '@app/models/id.interface';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: [ './device.component.scss' ],
  host: {
    class: 'page-container'
  }
})
export class DeviceComponent implements OnInit {
  device: DeviceModel | null = null;
  deviceCategories = EnumHelper.enumToArray(DeviceCategoryEnum);
  deviceTypes = EnumHelper.enumToArray(DeviceTypeEnum);

  form: FormGroup<DeviceFormInterface> = new FormGroup<DeviceFormInterface>({
    id: new FormControl<string | null | undefined>(''),
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private deviceService: DeviceService,
    private routerService: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private appService: AppService
  ) {

  }

  get name() {
    return this.form.controls['name'];
  }

  get position() {
    return this.form.controls['position'];
  }

  async ngOnInit(): Promise<void> {
    //this.ingredientTypes = await this.translatorService.translateLabels(this.ingredientTypes);
    console.log(this.deviceCategories);
    this.loadData();
  }

  loadData() {
    this.activatedRoute.data.subscribe(
      ((data) => {
        if (data && data['device']) {
          this.device = data['device'] as DeviceModel;
          this.appService.setSubTitle(this.device.name);
          this.form.setValue(this.device.toForm())
        } else {
          this.appService.setSubTitle();
        }
        this.loading = false;
      }));
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
    if (this.device) {
      const device = this.device as HasIdWithInterface<DeviceBackInterface>;

      this.confirmationService.confirm({
        key: 'device',
        message: $localize`Are you sure you want to delete it ?`,
        accept: () => {
          this.loading = true;
          this.deviceService.remove(device).then(async () => {
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
  }
}
