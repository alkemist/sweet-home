import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {
  it('sortBy', () => {
    const arrayNotSorted = [ { name: 'b' }, { name: 'c' }, { name: 'a' }, { name: 'c' } ];
    const arraySorted = [ { name: 'a' }, { name: 'b' }, { name: 'c' }, { name: 'c' } ];
    const arrayReturned = ArrayHelper.sortBy(arrayNotSorted, 'name');

    expect(arrayReturned).toEqual(arraySorted);
  });

  it('keysValuesToMap', () => {
    const firstValueKey = 'firstValue';
    const firstValueLabel = 'firstValue';
    const secondValueKey = 'firstValue';
    const secondValueLabel = 'firstValue';
    const map = new Map<string, string>([
      [ firstValueKey, firstValueLabel ],
      [ secondValueKey, secondValueLabel ],
    ]);

    const mapReturned = ArrayHelper.keysValuesToMap<string, string>
    ([ firstValueKey, secondValueKey ], [ firstValueLabel, secondValueLabel ]);

    expect(mapReturned).toEqual(map);
  });
});
