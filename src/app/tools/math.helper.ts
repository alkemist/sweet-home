import { CoordinateInterface, SizeInterface } from '@models';

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

  static orientationConverterPointToMap(
    position: CoordinateInterface,
    mapSize: SizeInterface,
    componentSize: SizeInterface,
    isLandscape: boolean
  ): CoordinateInterface {
    if (!isLandscape) {
      return position;
    }

    return {
      x: position.y,
      y: MathHelper.round(-position.x + mapSize.h - componentSize.h)
    }
  }

  // Convertisseur opposé
  static orientationConverterMapToPoint(
    position: CoordinateInterface,
    mapSize: SizeInterface,
    componentSize: SizeInterface,
    isLandscape: boolean
  ): CoordinateInterface {
    if (!isLandscape) {
      return position;
    }

    return {
      x: MathHelper.round(-position.y + mapSize.h - componentSize.h),
      y: position.x
    }
  }
}
