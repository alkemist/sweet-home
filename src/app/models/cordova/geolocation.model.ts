import { Geofence } from '@models';
import { MathHelper } from '@alkemist/smart-tools';

// https://cordova.apache.org/docs/en/11.x/reference/cordova-plugin-network-information/index.html
export enum ConnectionType {
  UNKNOWN,
  ETHERNET,
  WIFI,
  CELL_2G,
  CELL_3G,
  CELL_4G,
  CELL,
  NONE,
}

window.geofence = window.geofence || {};


export class GeolocationWorker {
  maxDistance = 1;

  constructor() {
    // https://cordova.apache.org/docs/en/11.x/reference/cordova-plugin-screen-orientation/index.html
    console.log('-- Cordova detected', window.geofence, window.screen.orientation.type, navigator.connection.type)

    window.geofence.initialize().then((initStatus: string) => {
      console.log("Successful initialization", initStatus);
      console.log(window.geofence);

      navigator.geolocation.getCurrentPosition((baseGeolocation) => {
        console.log('Current geolocation',
          baseGeolocation.coords.latitude,
          baseGeolocation.coords.longitude
        );

        navigator.geolocation.watchPosition((currentGeolocation) => {
          const distance = MathHelper.distance(
            baseGeolocation.coords.latitude,
            baseGeolocation.coords.longitude,
            currentGeolocation.coords.latitude,
            currentGeolocation.coords.longitude,
          );
          if (distance >= this.maxDistance) {
            console.log('Watch geolocation',
              currentGeolocation.coords.latitude,
              currentGeolocation.coords.longitude,
              distance
            );
          }
        }, (error) => {
          console.log(error);
        }, { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true });

        const geofenceConfiguration: Geofence = {
          id: 'home',
          latitude: baseGeolocation.coords.latitude,
          longitude: baseGeolocation.coords.longitude,
          radius: this.maxDistance,
          transitionType: 3,
          notification: {
            id: 1,
            title: "Welcome",
            text: "You change zone.",
            openAppOnClick: true
          }
        };

        window.geofence.addOrUpdate(geofenceConfiguration).then((initStatus: string) => {
          console.log('Geofence successfully added', initStatus);

          window.geofence.onTransitionReceived = (geofences: any) => {
            console.log('Geofence transition detected', geofences);
            /*geofences.forEach((geo: any) => {
              console.log('Geofence transition detected', geo);
            });*/
          }

          /*window.geofence.receiveTransition = (geofences: any) => {
            console.log('Geofence transition received', geofences);
          }*/

          /*window.geofence.ping().then((e: any) => {
            console.log('Geofence ping received', e);
          })*/
        }).catch((error: any) => {
          console.log('Adding geofence failed', error);
        });

        /*window.geofence.addOrUpdate({
          ...geofenceConfiguration,
          transitionType: 1,
        }).then(function () {
          console.log('Geofence successfully 1 added');
        }, function (error: any) {
          console.log('Adding geofence failed', error);
        });

        window.geofence.addOrUpdate({
          ...geofenceConfiguration,
          transitionType: 2,
        }).then(function () {
          console.log('Geofence successfully 2 added');
        }, function (error: any) {
          console.log('Adding geofence failed', error);
        });*/

        window.geofence.getWatched().then((geofencesJson: any) => {
          const geofences = JSON.parse(geofencesJson);
          console.log('Geofence watched', geofences);

          return geofencesJson;
        });
      }, (error) => {
        console.log(error);
      }, { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });
    }, (error: any) => {
      console.log("Error", error);
    });
  }
}
