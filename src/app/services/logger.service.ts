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

		if (!parseInt(environment["APP_DEBUG"] ?? "0")) {
			this.errorHandler.start({
				key: environment["GOOGLE_CLOUD_OPERATIONS_API_KEY"] as string,
				projectId: environment["FIREBASE_PROJECT_ID"] as string
			});
		}
	}

	error<T>(error: BaseError): BaseError {
		if (!parseInt(environment["APP_DEBUG"] ?? "0")) {
			this.errorHandler.report(error);
		} else {
			console.error(`-- Error [${error.type}]`, error.message, ":", error.context);
		}
		return error;
	}
}
