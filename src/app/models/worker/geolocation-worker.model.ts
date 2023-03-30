import {Subject} from "rxjs";

const navigator = window.navigator;

export class GeolocationWorker {
  constructor() {

  }

  private _ready$ = new Subject<boolean>();

  get ready$() {
    return this._ready$.asObservable();
  }

  checkPermission() {
    navigator.permissions.query({name: "geolocation"}).then((result) => {
      if (result.state === "granted") {
        // console.log('-- [Geolocation] Permission already accepted');
        this._ready$.next(true);
        // getLocation();
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(() => {
          //console.log('-- [Geolocation] Permission accepted');
          this._ready$.next(true);
        }, () => {
          //console.log('-- [Geolocation] Permission refused');
          this._ready$.next(false);
        });
      } else if (result.state === "denied") {
        //console.log('-- [Geolocation] Permission already refused');
        this._ready$.next(false);
      }
    })
  }
}
