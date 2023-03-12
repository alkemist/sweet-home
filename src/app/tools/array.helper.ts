import { slugify } from './slugify';
import { KeyValue } from '@angular/common';

export abstract class ArrayHelper {
  static sortBy<T>(array: T[], field: string): T[] {
    return array.sort((a: any, b: any) => {
      const aValue = slugify(a[field]!);
      const bValue = slugify(b[field]!);
      return (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : 0);
    });
  }

  static recordToList<T extends string, U>(record: Record<T, U>): KeyValue<string, U>[] {
    return Object.entries<U>(record).map(([ t, u ]: [ string, U ]) => ({
      key: t,
      value: u as U
    }));
  }

  static listToRecord<
    T extends { [K in keyof T]: string | number },
    K extends keyof T
  >(array: T[], selector: K): Record<T[K], T> {
    return array.reduce(
      (acc, item) => {
        acc[item[selector]] = item;
        return acc;
      }, {} as Record<T[K], T>
    )
  }
}
