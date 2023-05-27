import {TypeHelper} from "./type.helper";

export type JSONPath = string[];
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = {
  [key: string]: JSONValue;
} | JSONValue[] | JSONPrimitive;
export type JSONObject = {
  [key: string]: JSONValue;
};

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

  static getIn(object: JSONValue, path: JSONPath): JSONValue | undefined {
    let value: JSONValue | undefined = object
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
