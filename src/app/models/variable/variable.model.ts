import { DocumentModel, VariableBackInterface } from '@models';

export class VariableModel extends DocumentModel {
  constructor(data: VariableBackInterface) {
    super(data);

    this._value = data.value;
    this._key = data.key;
  }

  private _value: string;

  get value() {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  private _key: string;

  get key() {
    return this._key;
  }

  set key(key: string) {
    this._key = key;
  }

  toUniqueFields() {
    return {
      name: this._name,
    }
  }


  toStore(): VariableBackInterface {
    return {
      id: this._id,
      name: this._name,
      key: this._key,
      value: this._value
    }
  }

}
