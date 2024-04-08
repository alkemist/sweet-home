import { MultimediaCommandValues, MultimediaParameterValues } from '../../multimedia.interface';

export interface ChromecastCommandValues extends MultimediaCommandValues {
  online: boolean,
  player: string,
  display: string,
}

export interface ChromecastParameterValues extends MultimediaParameterValues {
  disableVolume: boolean,
}
