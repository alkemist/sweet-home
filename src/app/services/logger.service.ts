import {Injectable} from "@angular/core";
import {BaseError} from "@errors";
import {default as StackdriverErrorReporter} from "stackdriver-errors-js";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class LoggerService {
  errorHandler: StackdriverErrorReporter;

  constructor() {
    this.errorHandler = new StackdriverErrorReporter();
    this.init();
  }

  init() {
    if (!environment["APP_DEBUG"]) {
      this.errorHandler.start({
        key: environment["GOOGLE_CLOUD_OPERATIONS_API_KEY"] as string,
        projectId: environment["FIREBASE_PROJECT_ID"] as string
      });
    }
  }

  error<T>(error: BaseError): BaseError {
    if (!environment["APP_DEBUG"]) {
      this.errorHandler.report(error);
    } else {
      console.error(`-- Error [${error.type}]`, error.message, ":", error.context);
    }
    return error;
  }
}
