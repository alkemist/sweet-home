import {TypeHelper} from "./type.helper";

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = {
  [key: string]: JsonValue;
};
export type JsonArray = JsonValue[];
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;

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
    return Object.entries(object).reduce((result, [key, value]) => {
      result[key] = value as V;
      return result;
    }, {} as Record<string, V>)
  }

  static getIn(object: JsonValue, path: string[]): JsonValue | undefined {
    let value: JsonValue | undefined = object
    let i = 0

    if (value) {
      while (i < path.length) {
        if (TypeHelper.isObject(value)) {
          value = value[path[i]]
        } else if (TypeHelper.isArray(value)) {
          value = value[parseInt(path[i])]
        } else {
          value = undefined
        }

        i++
      }
    }

    return value
  }
}
