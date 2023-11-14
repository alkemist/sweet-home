import { MultimediaCommandValues } from '../multimedia.interface';

export interface SonosCommandValues extends MultimediaCommandValues {
  state: string,
  shuffle: boolean,
  repeat: boolean,
  album: string,
}
