import { generatePushID } from './generate-pushid';

describe('generate-pushid', () => {
  it('generate-pushid', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.6);
    jest
      .useFakeTimers()
      .setSystemTime(460462320000);
    expect(generatePushID()).toEqual('-5gpgLa-aaaaaaaaaaaa');
  });
});
