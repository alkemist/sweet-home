export interface TransitionType {
  ENTER: number;
  EXIT: number;
  BOTH: number;
}

export interface Window {
  geofence: GeofencePlugin;
  TransitionType: TransitionType;
}

export interface GeofencePlugin {
  onTransitionReceived: (geofences: Geofence[]) => void;
  onNotificationClicked: (notificationData: Object) => void;

  initialize(
    successCallback?: (result: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<any>;

  addOrUpdate(
    geofence: Geofence | Geofence[],
    successCallback?: (result: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<any>;

  remove(
    id: number | number[],
    successCallback?: (result: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<any>;

  removeAll(
    successCallback?: (result: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<any>;

  getWatched(
    successCallback?: (result: any) => void,
    errorCallback?: (error: string) => void
  ): Promise<string>;
}

export interface Geofence {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
  transitionType: number;
  notification?: GeofenceNotification;
}

export interface GeofenceNotification {
  id?: number;
  title?: string;
  text: string;
  smallIcon?: string;
  icon?: string;
  openAppOnClick?: boolean;
  vibration?: number[];
  data?: Object;
}
