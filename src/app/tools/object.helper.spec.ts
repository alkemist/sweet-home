import { ObjectHelper } from '@app/tools/object.helper';

describe('ObjectHelper', () => {
  it('clone', () => {
    const object = {
      cloned: false,
    };
    const clonedObject = ObjectHelper.clone(object);
    clonedObject.cloned = true;

    expect(object.cloned).toEqual(false);
    expect(clonedObject.cloned).toEqual(true);
    expect(clonedObject).not.toEqual(object);
  });
});