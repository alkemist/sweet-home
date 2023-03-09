import { DocumentInterface } from '@models';

export abstract class AddDocument<T extends DocumentInterface> {
  static readonly type: string = `[Document] Add`;

  protected constructor(public payload: T) {
  }
}

export abstract class UpdateDocument<T extends DocumentInterface> {
  static readonly type: string = `[Document] Update`;

  protected constructor(public payload: T) {
  }
}

export abstract class RemoveDocument<T extends DocumentInterface> {
  static readonly type: string = `[Document] Remove`;

  protected constructor(public payload: T) {
  }
}

export abstract class FillDocuments<T extends DocumentInterface> {
  static readonly type: string = `[Document] Fill`;

  protected constructor(public payload: T[]) {
  }
}
