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
}
