import { MultimediaCommandAction, MultimediaCommandInfo } from '@devices';

export type SonosExtendCommandInfo = SonosCommandInfo & MultimediaCommandInfo;
export type SonosGlobalCommandInfo = SonosCommandInfo | MultimediaCommandInfo;

export type SonosCommandInfo =
  'state'
  | 'shuffle' | 'repeat'
  | 'album'
  ;

export type SonosExtendCommandAction = SonosCommandAction & MultimediaCommandAction;
export type SonosGlobalCommandAction = SonosCommandAction | MultimediaCommandAction;

export type SonosCommandAction =
  | 'shuffle' | 'repeat'
  | 'favourite' | 'playlist' | 'radio'
  ;

export type SonosConfiguration =
  'ip'
  ;
