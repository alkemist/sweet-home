import { KeyValue } from '@angular/common';

export class SmartArrayModel<K extends string | number, V extends string | number> extends Array<KeyValue<K, V>> {
  record: Map<K, V> = new Map<K, V>();

  constructor(items: KeyValue<K, V>[] | Record<K, V> | Record<V, K> = [], isEnum = false) {
    super();

    if (Array.isArray(items)) {
      items.forEach((item) => {
        this.record.set(item.key, item.value);
      })
      this.push(...items);
    } else {
      if (isEnum) {
        this.fromEnum(items as Record<V, K>);
      } else {
        this.fromRecord(items as Record<K, V>);
      }
    }
  }

  fromRecord(record: Record<K, V>) {
    const keys = Object.keys(record) as K[];
    this.record = new Map<K, V>();

    this.push(...keys.map((key: K) => {
      const value = record[key] as V;
      this.record.set(key, value);
      return { key, value }
    }));
  }

  get(key: K): V {
    return this.record.get(key)!;
  }

  toRecord() {
    return this.reduce(
      (acc, item) => {
        acc[item.key] = item.value
        return acc;
      }
      , {} as Record<K, V>
    );
  }

  toArray(): KeyValue<K, V>[] {
    return this.map((item) => item);
  }

  getValues(): V[] {
    return this.map((item) => item.value);
  }

  fromEnum(enumValue: Record<V, K>) {
    const keys = Object.keys(enumValue) as V[];
    this.record = new Map<K, V>();

    this.push(...keys.map((value: V) => {
      const key = enumValue[value] as K;
      this.record.set(key, value);
      return { key, value }
    }));
  }
}
