import { Injectable } from "@angular/core";
import { BaseError } from "@errors";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoggerService {

  constructor() {
    this.init();
  }

  init() {
    if (!environment["APP_DEBUG"]) {

    }
  }

  error<T>(error: BaseError): BaseError {
    if (!environment["APP_DEBUG"]) {

    } else {
      console.error(`-- Error [${ error.type }]`, error.message, ":", error.context);
    }
    return error;
  }
}
