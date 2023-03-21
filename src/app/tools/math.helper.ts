export class MathHelper {
  static clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(min, value), max);
  }

  static round(value: number, decimal: number = 2) {
    return Math.round(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }

  static floor(value: number, decimal: number = 2) {
    return Math.floor(value * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
}
