import { generatePushID } from './generate-pushid';
import {timer} from "rxjs";
import {discardPeriodicTasks, fakeAsync, flush, tick} from "@angular/core/testing";

describe('generate-pushid', () => {
  it('generate-pushid', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    jest
      .useFakeTimers()
      .setSystemTime(460462320000);
    expect(generatePushID()).toEqual('-5gpgLa-aaaaaaaaaaaa');
  });
});

describe("Events", () => {
  const time = 1000;

  it('looks async but is synchronous', fakeAsync((): void => {
    let flag = null;

    const myObservable = timer(10, 50);
    myObservable.subscribe(data => {
      flag = data;
    });

    expect(flag).toBe(null);
    tick(50);
    expect(flag).toBe(0);
    tick(50);
    expect(flag).toBe(1);

    discardPeriodicTasks();
  }));
});
