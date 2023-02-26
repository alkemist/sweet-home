import { EnumHelper } from './enum.helper';

describe('EnumHelper', () => {
  enum enumKey {
    firstValue = 'firstValue',
    secondValue = 'secondValue'
  }

  enum enumValue {
    firstValue = 'First value',
    secondValue = 'Second value'
  }

  it('enumToObject', () => {
    const object = [ { key: 'firstValue', label: 'First value' }, { key: 'secondValue', label: 'Second value' } ];
    const objectReturned = EnumHelper.enumToObject(enumValue);
    expect(objectReturned).toEqual(object);
  });

  it('enumToMap', () => {
    const map = new Map<enumKey, enumValue>([
      [ enumKey.firstValue, enumValue.firstValue ],
      [ enumKey.secondValue, enumValue.secondValue ],
    ]);
    const mapReturned = EnumHelper.enumToMap<enumKey, enumValue>(enumValue);
    expect(mapReturned).toEqual(map);
  });

  it('enumToRegex', () => {
    const regex = /firstValue|secondValue/;
    const regexReturned = EnumHelper.enumToRegex(enumValue);
    expect(regexReturned).toEqual(regex);
  });
});
