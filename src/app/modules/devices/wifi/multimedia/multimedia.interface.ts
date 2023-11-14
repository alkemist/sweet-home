import { MultimediaCommandInfo, MultimediaParamValue } from '@devices';

export interface MultimediaCommandValues extends Record<MultimediaCommandInfo | string, string | number | boolean | null> {
  volume: number,
  muted: boolean,
  title: string,
  artist: string,
}

export interface MultimediaParameterValues extends Record<MultimediaParamValue | string, string | number | boolean | null> {
  volumeMax: number,
}
