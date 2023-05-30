export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = {
  [key: string]: JsonValue;
};
export type JsonArray = JsonValue[];
export type JsonValue = JsonObject | JsonArray | JsonPrimitive;

export abstract class ObjectHelper {
  static objectToRecord<V>(object: any) {
    return Object.entries(object).reduce((result, [key, value]) => {
      result[key] = value as V;
      return result;
    }, {} as Record<string, V>)
  }
}
