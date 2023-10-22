import { MultimediaCommandAction, MultimediaCommandInfo, MultimediaParamValue } from '@devices';

export type ChromecastExtendCommandInfo = ChromecastCommandInfo & MultimediaCommandInfo;
export type ChromecastGlobalCommandInfo = ChromecastCommandInfo | MultimediaCommandInfo;

export type ChromecastCommandInfo =
  'online'
  | 'player'
  | 'display'
  ;

export type ChromecastExtendCommandAction = ChromecastCommandAction & MultimediaCommandAction;
export type ChromecastGlobalCommandAction = ChromecastCommandAction | MultimediaCommandAction;

export type ChromecastCommandAction =
  'backdrop' | 'back'
  ;

export type ChromecastParamValue = 'disableVolume';
export const ChromecastParams = [ 'disableVolume' ];

export type ChromecastExtendParamValue = ChromecastParamValue & MultimediaParamValue;
export type ChromecastGlobalParamValue = ChromecastParamValue | MultimediaParamValue;
