export abstract class ObjectHelper {
  static clone<T>(object: T): T {
    const clone = Object.create(Object.getPrototypeOf(object));
    const props = Object.getOwnPropertyNames(object);
    props.forEach(function (key) {
      const desc = Object.getOwnPropertyDescriptor(object, key);
      if (desc) {
        Object.defineProperty(clone, key, desc);
      }
    });
    return clone;
  }

  static objectToRecord<V>(object: any) {
    return Object.entries(object).reduce((result, [ key, value ]) => {
      result[key] = value as V;
      return result;
    }, {} as Record<string, V>)
  }
}
