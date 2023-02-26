export abstract class ObjectHelper {
  static clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }
}