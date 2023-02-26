import { DataObjectInterface } from '@models';

export class DocumentNotFoundError<T extends DataObjectInterface> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string, document?: T) {
    super();
    this.collectionName = collectionName;
    this.message = `Document ["${ this.collectionName }"] not found ${ document ? `with id ${ document.id }` : '' }`;
  }
}
