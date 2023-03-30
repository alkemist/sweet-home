import {Subject} from "rxjs";

export class NotificationWorker {
  constructor() {

  }

  private _ready$ = new Subject<boolean>();

  get ready$() {
    return this._ready$.asObservable();
  }

  checkPermission() {
    if (Notification.permission === "granted") {
      //console.log('-- [Notification] Permission already accepted');
      this._ready$.next(true);
    } else if (Notification.permission === "default") {
      this.requestPermission();
    } else {
      //console.log('-- [Notification] Permission already refused');
      this._ready$.next(false);
    }
  }

  private requestPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        //console.log('-- [Notification] Permission accepted')
        this._ready$.next(true);
      } else if (permission === "default") {
        //console.log('-- [Notification] Permission pending');
        this.requestPermission();
      } else {
        // Prompt refusé par l'utilisateur
        //console.log('-- [Notification] Permission refused');
        this._ready$.next(false);
      }
    });
  }
}
