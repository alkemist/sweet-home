import { DocumentModel } from './document.model';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceCategoryEnum, DeviceTypeEnum } from './device.enum';
import { DeviceBackInterface, DeviceFrontInterface, DeviceStoredInterface } from './device.interface';
import { slugify } from '@tools';
import { HasIdInterface } from './id.interface';
import { SmartArrayModel } from './smart-array.model';

export class DeviceModel extends DocumentModel implements HasIdInterface {
  protected _position: CoordinateInterface;

  constructor(device: DeviceStoredInterface) {
    super(device);
    this._objectId = device.objectId ?? null;
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._commands = new SmartArrayModel<string, number>(device.commands);
    this._position = device.position ?? { x: null, y: null };
  }

  protected _objectId: number | null;

  get objectId(): number | null {
    return this._objectId;
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
      objectId: formData.objectId,
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
      objectId: this._objectId,
      position: this._position,
      category: this._category,
      type: this._type,
      commands: this._commands.toRecord(),
    }
  }

  override toForm(): DeviceFrontInterface {
    return {
      ...super.toForm(),
      objectId: this._objectId,
      position: this._position,
      category: this._category,
      type: this._type,
      commands: this._commands,
    };
  }
}
