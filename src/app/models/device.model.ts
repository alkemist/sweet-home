import { DocumentModel } from './document.model';
import { CoordinateInterface } from './coordinate.interface';
import { DeviceCategoryEnum, DeviceTypeEnum } from './device.enum';
import { DeviceBackInterface, DeviceFrontInterface, DeviceStoredInterface } from './device.interface';
import { slugify } from '@tools';
import { HasIdInterface } from './id.interface';
import { SmartArrayModel } from './smart-array.model';

export class DeviceModel extends DocumentModel implements HasIdInterface {
  constructor(device: DeviceStoredInterface) {
    super(device);
    this._jeedomId = device.jeedomId ?? null;
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._infoCommandIds = new SmartArrayModel<string, number>(device.infoCommandIds);
    this._actionCommandIds = new SmartArrayModel<string, number>(device.actionCommandIds);
    this._paramValues = new SmartArrayModel<string, number | string>(device.paramValues);
    this._position = device.position ?? { x: 0, y: 0 };
  }

  protected _position: CoordinateInterface;

  get position() {
    return this._position;
  }

  set position(position: CoordinateInterface) {
    this._position = position;
  }

  protected _jeedomId: number | null;

  get jeedomId(): number | null {
    return this._jeedomId;
  }

  protected _infoCommandIds: SmartArrayModel<string, number>;

  get infoCommandIds() {
    return this._infoCommandIds;
  }

  protected _actionCommandIds: SmartArrayModel<string, number>;

  get actionCommandIds() {
    return this._actionCommandIds;
  }

  protected _paramValues: SmartArrayModel<string, number | string>;

  get paramValues() {
    return this._paramValues;
  }

  get x(): number {
    return this._position.x;
  }

  set x(x: number) {
    this._position.x = x;
  }

  get y(): number {
    return this._position.y;
  }

  set y(y: number) {
    this._position.y = y;
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
      jeedomId: formData.jeedomId,
      slug: slugify(formData.name),
      category: formData.category,
      type: formData.type,
      position: formData.position,
      infoCommandIds: new SmartArrayModel<string, number>(formData.infoCommandIds).toRecord(),
      actionCommandIds: new SmartArrayModel<string, number>(formData.actionCommandIds).toRecord(),
      paramValues: new SmartArrayModel<string, string | number>(formData.paramValues).toRecord(),
    }

    return new DeviceModel(deviceData)
  }

  override toFirestore(): DeviceBackInterface {
    return {
      ...super.toFirestore(),
      jeedomId: this._jeedomId,
      position: this._position,
      category: this._category,
      type: this._type,
      infoCommandIds: this._infoCommandIds.toRecord(),
      actionCommandIds: this._actionCommandIds.toRecord(),
      paramValues: this._paramValues.toRecord(),
    }
  }

  override toForm(): DeviceFrontInterface {
    return {
      ...super.toForm(),
      jeedomId: this._jeedomId,
      position: this._position,
      category: this._category,
      type: this._type,
      infoCommandIds: this._infoCommandIds,
      actionCommandIds: this._actionCommandIds,
      paramValues: this._paramValues,
    };
  }
}
