import { DocumentModel, HasIdInterface } from '../document';
import { CoordinateInterface } from '../coordinate';
import { DeviceBackInterface, DeviceFrontInterface, DeviceInterface, DeviceStoredInterface } from './device.interface';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';
import { SmartMap, StringHelper } from '@alkemist/smart-tools';

export class DeviceModel extends DocumentModel implements HasIdInterface {
  constructor(device: DeviceStoredInterface) {
    super(device);
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
    this._position = device.position ?? { x: this._positionX, y: this._positionY };
  }

  protected _position: CoordinateInterface;

  get position() {
    return this._position;
  }

  set position(position: CoordinateInterface) {
    this._position = position;
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

  static importFormData(formData: DeviceFrontInterface) {
    const deviceData: DeviceStoredInterface = {
      id: formData.id,
      name: formData.name,
      slug: StringHelper.slugify(formData.name),
      connectivity: formData.connectivity,
      category: formData.category,
      type: formData.type,
      jeedomId: formData.jeedomId,
      position: formData.position,
      positionX: formData.positionX,
      positionY: formData.positionY,
      infoCommandIds: SmartMap.fromKeyValues(formData.infoCommandIds).toRecord(),
      actionCommandIds: SmartMap.fromKeyValues(formData.actionCommandIds).toRecord(),
      configurationValues: SmartMap.fromKeyValues(formData.configurationValues).toRecord(),
      parameterValues: SmartMap.fromKeyValues(formData.parameterValues).toRecord(),
    }

    return new DeviceModel(deviceData)
  }

  static importFormDataStore(formData: DeviceInterface) {
    const deviceData: DeviceStoredInterface = {
      id: formData.id,
      name: formData.name,
      slug: StringHelper.slugify(formData.name),
      connectivity: formData.connectivity,
      category: formData.category,
      type: formData.type,
      jeedomId: formData.jeedomId,
      position: formData.position,
      positionX: formData.positionX,
      positionY: formData.positionY,
      infoCommandIds: formData.infoCommandIds,
      actionCommandIds: formData.actionCommandIds,
      configurationValues: formData.configurationValues,
      parameterValues: formData.parameterValues,
    }

    return new DeviceModel(deviceData)
  }

  override toFirestore(): DeviceBackInterface {
    return {
      ...super.toFirestore(),
      connectivity: this._connectivity,
      category: this._category,
      type: this._type,
      jeedomId: this._jeedomId,
      position: this._position,
      infoCommandIds: this._infoCommandIds.toRecord(),
      actionCommandIds: this._actionCommandIds.toRecord(),
      configurationValues: this._configurationValues.toRecord(),
      parameterValues: this._parameterValues.toRecord(),
    }
  }

  override toForm(): DeviceFrontInterface {
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

  toStore(): DeviceInterface {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      connectivity: this._connectivity!,
      category: this._category!,
      type: this._type!,
      jeedomId: this._jeedomId,
      position: this._position,
      positionX: this._positionX,
      positionY: this._positionY,
      infoCommandIds: this._infoCommandIds.toRecord(),
      actionCommandIds: this._actionCommandIds.toRecord(),
      configurationValues: this._configurationValues.toRecord(),
      parameterValues: this._parameterValues.toRecord(),
    };
  }
}
