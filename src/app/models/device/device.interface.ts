import { KeyValue } from '@angular/common';
import { CoordinateInterface } from '../coordinate';
import { DeviceCategoryEnum, DeviceConnectivityEnum, DeviceTypeEnum } from './device.enum';
import { DocumentBackInterface, DocumentFormInterface, DocumentFrontInterface } from '@alkemist/ngx-data-store';

export interface DeviceModelInterface extends DocumentBackInterface {
  connectivity: DeviceConnectivityEnum | null,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  jeedomId: number | null,
  position?: CoordinateInterface,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: KeyValue<string, number>[],
  actionCommandIds: KeyValue<string, number>[],
  configurationValues: KeyValue<string, string>[],
  parameterValues: KeyValue<string, string>[],
}

export interface DeviceBackInterface extends DocumentBackInterface {
  connectivity: DeviceConnectivityEnum,
  connectivityLabel?: string,
  category: DeviceCategoryEnum,
  categoryLabel?: string,
  type: DeviceTypeEnum,
  typeLabel?: string,
  jeedomId: number | null,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: Record<string, number>,
  actionCommandIds: Record<string, number>,
  configurationValues: Record<string, string>,
  parameterValues: Record<string, string>,
}

export interface DeviceFrontInterface extends DocumentFrontInterface {
  connectivity: DeviceConnectivityEnum | null,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  jeedomId: number | null,
  position?: CoordinateInterface,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: Record<string, number>,
  actionCommandIds: Record<string, number>,
  configurationValues: Record<string, string>,
  parameterValues: Record<string, string>,
}

export interface DeviceInputInterface extends DocumentFormInterface {
  connectivity: DeviceConnectivityEnum | null,
  category: DeviceCategoryEnum | null,
  type: DeviceTypeEnum | null,
  jeedomId: number | null,
  position?: CoordinateInterface,
  positionX?: number | null,
  positionY?: number | null,
  infoCommandIds: Record<string, number>,
  actionCommandIds: Record<string, number>,
  configurationValues: Record<string, string>,
  parameterValues: Record<string, string>,
}
