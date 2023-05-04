import {DocumentBackInterface, DocumentFrontInterface, DocumentStoredInterface} from './document.interface';
import {HasIdInterface} from './id.interface';
import {slugify} from '@tools';


export class DocumentModel implements HasIdInterface {
  constructor(document: DocumentStoredInterface) {
    this._id = document.id;
    this._name = document.name;
    this._slug = document.slug;
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

  set slug(slug: string) {
    this._slug = slug;
  }

  nameContain(search: string): boolean {
    const regexName = new RegExp(search, 'gi');
    const regexSlug = new RegExp(slugify(search), 'gi');
    return this.name.search(regexName) > -1 || (this.slug !== undefined && this.slug.search(regexSlug) > -1);
  }

  toFirestore(): DocumentBackInterface {
    return {
      name: this._name,
      slug: this._slug,
    }
  }

  toForm(): DocumentFrontInterface {
    return {
      id: this._id,
      name: this._name,
    }
  }

  importFormData(formData: DocumentFrontInterface) {
    this._name = formData.name;
  }
}
