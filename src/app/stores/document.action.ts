import { DocumentStoredInterface } from '@models';
import { HasIdInterface } from '../models/id.interface';

export abstract class AddDocument<S extends DocumentStoredInterface> {
  static readonly type: string = `[Document] Add`;

  protected constructor(public payload: S) {
  }
}

export abstract class UpdateDocument<S extends DocumentStoredInterface> {
  static readonly type: string = `[Document] Update`;

  protected constructor(public payload: S) {
  }
}

export abstract class RemoveDocument<S extends HasIdInterface> {
  static readonly type: string = `[Document] Remove`;

  protected constructor(public payload: S) {
  }
}

export abstract class FillDocuments<S extends DocumentStoredInterface> {
  static readonly type: string = `[Document] Fill`;

  protected constructor(public payload: S[]) {
  }
}

export abstract class InvalideDocuments<S extends DocumentStoredInterface> {
  static readonly type: string = `[Document] Invalide`;

  protected constructor() {
  }
}
