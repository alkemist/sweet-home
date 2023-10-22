import { MultimediaCommandValues } from '../multimedia.component';

export interface SonosCommandValues extends MultimediaCommandValues {
  state: string,
  shuffle: boolean,
  repeat: boolean,
  album: string,
}
