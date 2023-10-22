import { MultimediaCommandValues, MultimediaParameterValues } from '../multimedia.component';

export interface ChromecastCommandValues extends MultimediaCommandValues {
  online: boolean,
  player: string,
  display: string,
}

export interface ChromecastParameterValues extends MultimediaParameterValues {
  disableVolume: boolean,
}
