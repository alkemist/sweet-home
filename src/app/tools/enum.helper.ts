export abstract class EnumHelper {
  static enumToRegex(enumValue: any): RegExp {
    const keys = Object.keys(enumValue);
    return new RegExp(keys.join('|'));
  }
}
