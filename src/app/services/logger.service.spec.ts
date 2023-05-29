import {TestBed} from '@angular/core/testing';
import {DatabaseError} from '@errors';
import {LoggerService} from '@services';
import {environment} from "../../environments/environment";


describe('LoggerService', () => {
  let service: LoggerService;
  let collectionName: string = "test";
  let errorMessage: string = "test";
  let errorContext = {id: 1};
  const error = new DatabaseError(collectionName, errorMessage, errorContext);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("init", () => {
    let startSpy: jest.SpyInstance;

    beforeEach(() => {
      startSpy = jest.spyOn(service.errorHandler, 'start');
    });

    it('should not be init in development', () => {
      environment["APP_DEBUG"] = true;

      service.init();

      expect(startSpy).toBeCalledTimes(0);
    });

    it('should be init in production', () => {
      environment["APP_DEBUG"] = false;
      environment["GOOGLE_CLOUD_OPERATIONS_API_KEY"] = "1";
      environment["FIREBASE_PROJECT_ID"] = "2";

      service.init();

      expect(startSpy).toBeCalledWith({
        key: environment["GOOGLE_CLOUD_OPERATIONS_API_KEY"],
        projectId: environment["FIREBASE_PROJECT_ID"],
      });
    });
  });

  describe("log error", () => {
    let consoleSpy: jest.SpyInstance;
    let reportSpy: jest.SpyInstance;

    beforeEach(() => {
      reportSpy = jest.spyOn(service.errorHandler, 'report');
      consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    it('should be send report in production', () => {
      environment["APP_DEBUG"] = false;

      service.error(error);

      expect(reportSpy).toBeCalledWith(error);
      expect(consoleSpy).toBeCalledTimes(0);
    });

    it('should be write in console in development', () => {
      environment["APP_DEBUG"] = true;

      service.error(error);

      expect(consoleSpy).toBeCalledWith(`-- Error [${error.type}]`,
        `Document ["${collectionName}"] ${errorMessage}`, ':', errorContext);

      expect(reportSpy).toBeCalledTimes(0);
    });
  });


});
