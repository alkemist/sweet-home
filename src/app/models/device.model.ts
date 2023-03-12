import { DocumentModel } from './document.model';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceTypeEnum } from './device-type.enum';
import { DeviceCategoryEnum } from './device-category.enum';
import { DeviceBackInterface, DeviceFrontInterface, DeviceStoredInterface } from './device.interface';
import { ArrayHelper, slugify } from '@tools';

export class DeviceModel extends DocumentModel {
  protected _position: CoordinateInterface;
  protected _commands: Record<string, number>;

  constructor(device: DeviceStoredInterface) {
    super(device);
    this._position = device.position ?? { x: null, y: null };
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._commands = device.commands ?? {};
  }

  protected _category: DeviceCategoryEnum | null;

  get category() {
    return this._category ?? '';
  }

  protected _categoryLabel: string = '';

  get categoryLabel() {
    return this._categoryLabel;
  }

  set categoryLabel(categoryLabel: string) {
    this._categoryLabel = categoryLabel;
  }

  protected _type: DeviceTypeEnum | null;

  get type() {
    return this._type;
  }

  static importFormData(formData: DeviceFrontInterface) {
    const deviceData: DeviceStoredInterface = {
      id: formData.id,
      name: formData.name,
      slug: slugify(formData.name),
      category: formData.category,
      type: formData.type,
      position: formData.position,
      commands: formData.commands.reduce(
        (acc, item) => {
          acc[item.key] = item.value
          return acc;
        }
        , {} as Record<string, number>
      )
    }

    return new DeviceModel(deviceData)
  }

  override toFirestore(): DeviceBackInterface {
    return {
      ...super.toFirestore(),
      position: this._position,
      category: this._category,
      type: this._type,
      commands: this._commands,
    }
  }

  override toForm(): DeviceFrontInterface {
    return {
      ...super.toForm(),
      position: this._position,
      category: this._category,
      type: this._type,
      commands: ArrayHelper.recordToList(this._commands),
    };
  }
}
