import { CoordinateInterface, SizeInterface } from '@models';
import { MathHelper } from '@alkemist/smart-tools';

export class MapHelper {
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
