import { DocumentInterface } from '@app/models/document.interface';
import { slugify } from '@tools';

export class DocumentModel {
  constructor(document: DocumentInterface) {
    this._id = document.id ?? '';
    this._name = document.name ?? '';
    this._slug = document.slug ?? '';
  }

  protected _id: string;

  get id() {
    return this._id;
  }

  protected _name: string;

  get name() {
    return this._name;
  }

  protected _slug: string;

  get slug() {
    return this._slug;
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || this.slug.search(regexSlug) > -1;
  }

  toFirestore(): DocumentInterface {
    return {
      name: this._name,
      slug: this._slug,
    }
  }
}
