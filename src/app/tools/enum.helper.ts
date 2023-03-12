import { KeyLabelInterface } from '@models';
import { ArrayHelper } from './array.helper';

export abstract class EnumHelper {
  static enumToArray(enumValue: any): KeyLabelInterface<string, string>[] {
    const keys = Object.values(enumValue) as string[];
    const labels = Object.keys(enumValue) as string[];
    const objects = keys.map((value, index) => {
      return { key: value, label: labels[index] };
    });
    return ArrayHelper.sortBy<KeyLabelInterface<string, string>>(objects, 'label');
  }

  static arrayToObject(enumValues: KeyLabelInterface<string, string>[]): Record<string, string> {
    return enumValues.reduce(
      (acc, item) => {
        acc[item.key] = item.label
        return acc;
      }, {} as Record<string, string>
    );
  }

  static enumToMap<T extends string, U extends string>(enumValue: any): Map<T, U> {
    const keys = Array.from(Object.keys(enumValue)) as T[];
    const values = Object.values(enumValue) as U[];
    return ArrayHelper.keysValuesToMap<T, U>(keys, values);
  }

  static enumToRegex(enumValue: any): RegExp {
    const keys = Object.keys(enumValue);
    return new RegExp(keys.join('|'));
  }
}
