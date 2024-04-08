import { MultimediaCommandAction, MultimediaCommandInfo, MultimediaParamValue } from '@devices';

export type AndroidExtendCommandInfo = AndroidCommandInfo & MultimediaCommandInfo;
export type AndroidGlobalCommandInfo = AndroidCommandInfo | MultimediaCommandInfo;

export type AndroidCommandInfo =
  'online'
  | 'player'
  | 'display'
  ;

export type AndroidExtendCommandAction = AndroidCommandAction & MultimediaCommandAction;
export type AndroidGlobalCommandAction = AndroidCommandAction | MultimediaCommandAction;

export type AndroidCommandAction =
  'backdrop' | 'back'
  ;

export type AndroidParamValue = 'disableVolume';
export const AndroidParams = [ 'disableVolume' ];

export type AndroidExtendParamValue = AndroidParamValue & MultimediaParamValue;
export type AndroidGlobalParamValue = AndroidParamValue | MultimediaParamValue;
