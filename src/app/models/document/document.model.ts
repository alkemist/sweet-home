import { DataStoreUserInterface, DocumentBackInterface, DocumentFormInterface } from '@alkemist/ngx-data-store';


export class DocumentModel {
  constructor(document: DocumentFormInterface) {
    this._id = document.id ?? '';
    this._name = document.name;
    this._slug = document.slug ?? '';
    this._user = document.user ?? null;
  }

  protected _user: DataStoreUserInterface | null;

  get user() {
    return this._user;
  }

  protected _id: string;

  get id() {
    return this._id;
  }

  protected _slug: string;

  get slug() {
    return this._slug;
  }

  set slug(slug: string) {
    this._slug = slug;
  }

  protected _name: string;

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  toForm(): DocumentBackInterface {
    return {
      id: this._id,
      name: this._name,
    }
  }
}
