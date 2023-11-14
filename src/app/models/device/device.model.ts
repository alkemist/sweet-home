import { DocumentModel, HasIdInterface } from '../document';
import { CoordinateInterface } from '../coordinate';
import { DeviceBackInterface, DeviceFrontInterface, DeviceStoredInterface } from './device.interface';
import { slugify } from '@tools';
import { SmartArrayModel } from '../smart';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';

export class DeviceModel extends DocumentModel implements HasIdInterface {
  constructor(device: DeviceStoredInterface) {
    super(device);
    this._jeedomId = device.jeedomId ?? null;
    this._connectivity = device.connectivity ?? null;
    this._category = device.category ?? null;
    this._type = device.type ?? null;
    this._infoCommandIds = new SmartArrayModel<string, number>(device.infoCommandIds);
    this._infoCommandIds = new SmartArrayModel<string, number>(device.infoCommandIds);
    this._actionCommandIds = new SmartArrayModel<string, number>(device.actionCommandIds);
    this._configurationValues = new SmartArrayModel<string, string>(device.configurationValues);
    this._parameterValues = new SmartArrayModel<string, string>(device.parameterValues);
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

  protected _configurationValues: SmartArrayModel<string, string>;

  get configurationValues() {
    return this._configurationValues;
  }

  protected _parameterValues: SmartArrayModel<string, string>;

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
    return this._connectivity ?? '';
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
      slug: slugify(formData.name),
      connectivity: formData.connectivity,
      category: formData.category,
      type: formData.type,
      jeedomId: formData.jeedomId,
      position: formData.position,
      infoCommandIds: new SmartArrayModel<string, number>(formData.infoCommandIds).toRecord(),
      actionCommandIds: new SmartArrayModel<string, number>(formData.actionCommandIds).toRecord(),
      configurationValues: new SmartArrayModel<string, string>(formData.configurationValues).toRecord(),
      parameterValues: new SmartArrayModel<string, string>(formData.parameterValues).toRecord(),
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
      position: this._position,
      infoCommandIds: this._infoCommandIds,
      actionCommandIds: this._actionCommandIds,
      configurationValues: this._configurationValues,
      parameterValues: this._parameterValues,
    };
  }
}
