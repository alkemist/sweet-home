import { Injectable } from '@angular/core';
import { BaseError } from '@errors';
import { default as StackdriverErrorReporter } from 'stackdriver-errors-js';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  errorHandler: StackdriverErrorReporter;

  constructor() {
    this.errorHandler = new StackdriverErrorReporter();

    if (!parseInt(process.env['APP_DEBUG'] ?? '0')) {
      this.errorHandler.start({
        key: process.env['GOOGLE_CLOUD_OPERATIONS_API_KEY'] as string,
        projectId: process.env['FIREBASE_PROJECT_ID'] as string
      });
    }
  }

  error<T>(error: BaseError): BaseError {
    if (!parseInt(process.env['APP_DEBUG'] ?? '0')) {
      this.errorHandler.report(error);
    } else {
      console.error(`-- Error [${ error.type }]`, error.message, ':', error.context);
    }
    return error;
  }
}
