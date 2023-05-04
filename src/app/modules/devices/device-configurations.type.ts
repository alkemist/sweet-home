import {PartialRecord} from "@models";
import {DeviceConfigurations, DeviceDefinitions} from "./device-configurations.interface";

export type DeviceDefinitionsBy<U extends string> = PartialRecord<U, DeviceDefinitions>;
export type DeviceConfigurationBy<U extends string> = PartialRecord<U, DeviceConfigurations>;
export type GroupedDeviceDefinitions<T extends string, U extends string> =
  Record<T, DeviceDefinitionsBy<U>>;
export type GlobalDeviceDefinitions<T extends string, U extends string, V extends string> =
  Record<T, PartialRecord<U, DeviceDefinitionsBy<V>>>;
export type GlobalDeviceConfigurations<T extends string, U extends string, V extends string> =
  Record<T, PartialRecord<U, DeviceConfigurationBy<V>>>;
export type DeviceCommands<E extends string> = Record<E, Record<string, string>>;
export type DeviceConfiguration<E extends string> = Record<E, string>;
