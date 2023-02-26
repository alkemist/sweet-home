import { TestBed } from '@angular/core/testing';
import { DatabaseError } from '@errors';

import { LoggerService } from '@services';
import { environment } from '../../environments/environment';

jest.mock('stackdriver-errors-js');

describe('LoggerService', () => {
  let service: LoggerService;
  let error: DatabaseError;
  let errorMessage: string;
  let errorContext: any;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);

    errorMessage = 'test;';
    errorContext = { id: 1 };
    error = new DatabaseError(errorMessage, errorContext);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be init', () => {
    const startSpy = jest.spyOn(service.errorHandler, 'start').mockImplementation();
    service.init();
    expect(startSpy).toBeCalledWith({
      key: environment.GOOGLE_CLOUD_OPERATIONS_API_KEY,
      projectId: environment.FIREBASE_PROJECT_ID
    });
  });

  it('should be send report in production', () => {
    environment.production = true;
    const reportSpy = jest.spyOn(service.errorHandler, 'report').mockImplementation();
    service.error(error);
    expect(reportSpy).toBeCalledWith(error);
  });

  it('should be write in console in development', () => {
    environment.production = false;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    service.error(error);
    expect(consoleSpy).toBeCalledWith(`-- Error [${ error.type }]`, error.message, error.context);
  });
});
