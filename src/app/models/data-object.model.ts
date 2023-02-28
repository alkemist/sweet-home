import { DataObjectInterface } from '@app/models/data-object.interface';

export class DataObjectModel {
  protected _id: string;

  constructor(document: DataObjectInterface) {
    this._id = document.id ?? '';
    this._name = document.name ?? '';
    this._slug = document.slug ?? '';
  }

  protected _name: string;

  get name() {
    return this._name;
  }

  protected _slug: string;

  get slug() {
    return this._slug;
  }

  toFirestore(): DataObjectInterface {
    return {
      name: this._name,
      slug: this._slug,
    }
  }
}
