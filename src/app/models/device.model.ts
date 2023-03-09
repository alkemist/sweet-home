import { DocumentModel } from '@app/models/document.model';
import { Coordinate, DeviceCategoryEnum, DeviceInterface, DeviceTypeEnum } from '@app/models/device.interface';

export class DeviceModel extends DocumentModel {
  protected _position: Coordinate;
  protected _category: DeviceCategoryEnum;
  protected _type: DeviceTypeEnum;

  constructor(device: DeviceInterface) {
    super(device);
    this._position = device.position;
    this._category = device.category;
    this._type = device.type;
  }

  override toFirestore(): DeviceInterface {
    return {
      ...super.toFirestore(),
      position: this._position,
      category: this._category,
      type: this._type,
    }
  }
}
