import { MultimediaCommandValues, MultimediaParameterValues } from '../../multimedia.interface';

export interface AndroidCommandValues extends MultimediaCommandValues {
  online: boolean,
  player: string,
  display: string,
}

export interface AndroidParameterValues extends MultimediaParameterValues {
  disableVolume: boolean,
}
