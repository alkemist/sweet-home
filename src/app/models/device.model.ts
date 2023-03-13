import { DocumentModel } from './document.model';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceTypeEnum } from './device-type.enum';
import { DeviceCategoryEnum } from './device-category.enum';
import { DeviceBackInterface, DeviceFrontInterface, DeviceStoredInterface } from './device.interface';
import { slugify } from '@tools';
import { SmartArrayModel } from '@app/models/smart-array.model';
import { HasIdInterface } from '@app/models/id.interface';

export class DeviceModel extends DocumentModel implements HasIdInterface {
  protected _position: CoordinateInterface;

  constructor(device: DeviceStoredInterface) {
    super(device);
    this._position = device.position ?? { x: null, y: null };
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._commands = new SmartArrayModel<string, number>(device.commands);
  }

  protected _commands: SmartArrayModel<string, number>;

  get commands() {
    return this._commands;
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

  protected _typeLabel: string = '';

  get typeLabel() {
    return this._typeLabel;
  }

  set typeLabel(typeLabel: string) {
    this._typeLabel = typeLabel;
  }

  protected _type: DeviceTypeEnum | null;

  get type() {
    return this._type ?? '';
  }

  static importFormData(formData: DeviceFrontInterface) {
    const deviceData: DeviceStoredInterface = {
      id: formData.id,
      name: formData.name,
      slug: slugify(formData.name),
      category: formData.category,
      type: formData.type,
      position: formData.position,
      commands: new SmartArrayModel<string, number>(formData.commands).toRecord()
    }

    return new DeviceModel(deviceData)
  }

  override toFirestore(): DeviceBackInterface {
    return {
      ...super.toFirestore(),
      position: this._position,
      category: this._category,
      type: this._type,
      commands: this._commands.toRecord(),
    }
  }

  override toForm(): DeviceFrontInterface {
    return {
      ...super.toForm(),
      position: this._position,
      category: this._category,
      type: this._type,
      commands: this._commands,
    };
  }
}
