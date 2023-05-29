// @ts-ignore
import Cordova from "cordova";
import {GeofencePlugin, TransitionType} from "@models";
import {Buffer} from "buffer";

declare global {
  interface Window {
    cordova: Cordova;
    geofence: GeofencePlugin;
    TransitionType: TransitionType;
    Buffer: BufferConstructor;
  }

  interface Navigator {
    connection: any;
  }

  interface BufferConstructor {
    from(
      str: string
    ): Buffer;
  }
}

window.Buffer = window.Buffer || Buffer;
window.cordova = window.cordova || undefined;
