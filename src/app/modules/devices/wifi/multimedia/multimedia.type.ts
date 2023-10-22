export type MultimediaCommandInfo = 'volume' | 'muted'
  | 'title' | 'artist';
export type MultimediaCommandAction = 'volume'
  | MultimediaPlayerCommandAction | MultimediaTitleCommandAction | MultimediaMuteCommandAction;
export type MultimediaPlayerCommandAction = 'play' | 'pause' | 'stop';
export type MultimediaTitleCommandAction = 'previous' | 'next';
export type MultimediaMuteCommandAction = 'mute' | 'unmute';

export type MultimediaParamValue = 'volumeMax';
