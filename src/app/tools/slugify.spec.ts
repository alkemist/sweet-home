import { slugify } from './slugify';

describe('slugify', () => {
  it('should slugify', () => {
    expect(slugify()).toEqual('');
    expect(slugify('Azért(#@%i " qWérti°')).toEqual('azerti-qwerti');
  });
});