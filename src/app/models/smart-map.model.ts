export class SmartMapModel<K, V> extends Map<K, V> {
  items: V[] = [];

  constructor() {
    super();
  }

  override set(key: K, value: V): this {
    this.items.push(value);
    return super.set(key, value);
  }

  toArray() {
    return this.items;
  }
}
