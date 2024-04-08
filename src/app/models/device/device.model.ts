import { DeviceBackInterface, DeviceInputInterface, DeviceModelInterface } from './device.interface';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';
import { SmartMap } from '@alkemist/smart-tools';
import { DocumentModel } from '../document';

export class DeviceModel extends DocumentModel {
  constructor(device: DeviceInputInterface) {
    super(device);
    this._name = device.name ?? null;
    this._jeedomId = device.jeedomId ?? null;
    this._connectivity = device.connectivity ?? null;
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._infoCommandIds = SmartMap.fromRecord(device.infoCommandIds ?? {});
    this._actionCommandIds = SmartMap.fromRecord(device.actionCommandIds ?? {});
    this._configurationValues = SmartMap.fromRecord(device.configurationValues ?? {});
    this._parameterValues = SmartMap.fromRecord(device.parameterValues ?? {});
    this._positionX = device.positionX ?? 0;
    this._positionY = device.positionY ?? 0;
  }

  protected _positionX: number;

  get positionX() {
    return this._positionX;
  }

  set positionX(positionX: number) {
    this._positionX = positionX;
  }

  protected _positionY: number;

  get positionY() {
    return this._positionY;
  }

  set positionY(positionY: number) {
    this._positionY = positionY;
  }

  protected _jeedomId: number | null;

  get jeedomId(): number | null {
    return this._jeedomId;
  }

  protected _infoCommandIds: SmartMap<number>;

  get infoCommandIds() {
    return this._infoCommandIds;
  }

  protected _actionCommandIds: SmartMap<number>;

  get actionCommandIds() {
    return this._actionCommandIds;
  }

  protected _configurationValues: SmartMap<string>;

  get configurationValues() {
    return this._configurationValues;
  }

  protected _parameterValues: SmartMap<string>;

  get parameterValues() {
    return this._parameterValues;
  }

  get x(): number {
    return this._positionX;
  }

  set x(x: number) {
    this._positionX = x;
  }

  get y(): number {
    return this._positionY;
  }

  set y(y: number) {
    this._positionY = y;
  }

  protected _connectivity: DeviceConnectivityEnum | null;

  get connectivity() {
    return this._connectivity;
  }

  protected _category: DeviceCategoryEnum | null;

  get category() {
    return this._category ?? '';
  }

  protected _connectivityLabel: string = '';

  get connectivityLabel() {
    return this._connectivityLabel;
  }

  set connectivityLabel(connectivityLabel: string) {
    this._connectivityLabel = connectivityLabel;
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

  static importFormData(formData: DeviceModelInterface) {
    const deviceData: DeviceInputInterface = {
      id: formData.id,
      name: formData.name!,
      connectivity: formData.connectivity!,
      category: formData.category!,
      type: formData.type!,
      jeedomId: formData.jeedomId,
      positionX: formData.positionX,
      positionY: formData.positionY,
      infoCommandIds: SmartMap.fromKeyValues(formData.infoCommandIds).toRecord(),
      actionCommandIds: SmartMap.fromKeyValues(formData.actionCommandIds).toRecord(),
      configurationValues: SmartMap.fromKeyValues(formData.configurationValues).toRecord(),
      parameterValues: SmartMap.fromKeyValues(formData.parameterValues).toRecord(),
    }

    return new DeviceModel(deviceData)
  }

  override toForm(): DeviceModelInterface {
    return {
      ...super.toForm(),
      connectivity: this._connectivity,
      category: this._category,
      type: this._type,
      jeedomId: this._jeedomId,
      positionX: this._positionX,
      positionY: this._positionY,
      infoCommandIds: this._infoCommandIds.toKeyValues(),
      actionCommandIds: this._actionCommandIds.toKeyValues(),
      configurationValues: this._configurationValues.toKeyValues(),
      parameterValues: this._parameterValues.toKeyValues(),
    };
  }

  toStore(): DeviceBackInterface {
    return {
      id: this._id,
      name: this._name,
      connectivity: this._connectivity!,
      category: this._category!,
      type: this._type!,
      jeedomId: this._jeedomId,
      positionX: this._positionX,
      positionY: this._positionY,
      infoCommandIds: this._infoCommandIds.toRecord(),
      actionCommandIds: this._actionCommandIds.toRecord(),
      configurationValues: this._configurationValues.toRecord(),
      parameterValues: this._parameterValues.toRecord(),
    };
  }

  toUniqueFields(): Partial<DeviceBackInterface> {
    return {
      name: this._name,
      //slug: StringHelper.slugify(this._name),
      jeedomId: this._jeedomId
    }
  }
}
