import { dateMock } from '@mocks';
import { TimeHelper } from './time.helper';

describe('TimeHelper', () => {
  it('calcHoursAfter', () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(460465920000);
    jest.spyOn(dateMock, 'getTime').mockReturnValue(460462320000);
    const hours = TimeHelper.calcHoursAfter(dateMock);
    expect(hours).toEqual(1);
  });
});
