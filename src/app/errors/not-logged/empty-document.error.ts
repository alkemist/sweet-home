import { DocumentInterface } from '@models';

export class EmptyDocumentError<T extends DocumentInterface> extends Error {
  private readonly collectionName: string;

  constructor(collectionName: string) {
    super();
    this.collectionName = collectionName;
    this.message = `Document ["${ this.collectionName }"] is empty`;
  }
}
