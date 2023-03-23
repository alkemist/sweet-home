import { DatabaseError, DocumentNotFoundError, EmptyDocumentIdError, QuotaExceededError } from '@errors';
import { FirestoreDataConverter } from '@firebase/firestore';
import { LoggerService } from '@services';
import { generatePushID, slugify } from '@tools';
import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore';
import { DocumentBackInterface, DocumentModel } from '@models';
import { objectConverter } from '../converters/object.converter';
import { HasIdInterface, HasIdWithInterface } from '../models/id.interface';
import { MessageService } from 'primeng/api';


export abstract class FirestoreService<
  B extends DocumentBackInterface,
  M extends DocumentModel
> {
  private readonly ref: CollectionReference;

  protected constructor(
    protected messageService: MessageService,
    private loggerService: LoggerService,
    protected collectionName: string,
    protected collectionNameTranslated: string,
    protected type: (new (data: HasIdWithInterface<B>) => M),
    private converter: FirestoreDataConverter<B> = objectConverter<B>(),
  ) {
    this.ref = collection(getFirestore(), collectionName);
  }

  public async exist(name: string): Promise<boolean> {
    if (!name) {
      return false;
    }

    const slug = slugify(name);

    let dataObjectDocument = null;
    try {
      dataObjectDocument = await this.findOneBySlug(slug);
    } catch (error) {
      if (error instanceof DocumentNotFoundError) {
        return false;
      }
    }
    return !!dataObjectDocument;
  }

  public async findOneById(id: string): Promise<HasIdWithInterface<B>> {
    let docSnapshot;
    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      docSnapshot = await getDoc(ref);
    } catch (error) {
      this.loggerService.error(new DatabaseError(
        this.collectionName,
        (error as Error).message,
        { id }
      ));
    }

    if (!docSnapshot) {
      throw new DocumentNotFoundError(this.collectionName);
    }

    const document = docSnapshot.data();

    if (!document) {
      throw new DocumentNotFoundError(this.collectionName);
    }

    return {
      id: docSnapshot.id,
      ...document
    };
  }

  public async findOneBy(property: string, value: string): Promise<HasIdWithInterface<B>> {
    let list: HasIdWithInterface<B>[] = [];

    try {
      list = await this.queryList(where(property, '==', value));
    } catch (error) {
      this.loggerService.error(new DatabaseError(
        this.collectionName,
        (error as Error).message,
        { [property]: value }
      ));
    }

    if (list.length === 0) {
      throw new DocumentNotFoundError(this.collectionName);
    }
    return list[0];
  }

  public async findOneBySlug(slug: string): Promise<HasIdWithInterface<B>> {
    return this.findOneBy('slug', slug);
  }

  public async addOne(document: M): Promise<HasIdWithInterface<B>> {
    const id = generatePushID();

    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      await setDoc(ref, document.toFirestore());
      this.messageService.add({
        severity: 'success',
        summary: `${ this.collectionNameTranslated } ${ $localize`added` }`
      });
    } catch (error) {
      this.loggerService.error(new DatabaseError(
        this.collectionName,
        (error as Error).message,
        document
      ));
    }
    return await this.findOneById(id);
  }

  public async updateOne(document: M): Promise<HasIdWithInterface<B>> {
    if (!document.id) {
      throw new EmptyDocumentIdError(this.collectionName, document);
    }

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await setDoc(ref, document.toFirestore());
      this.messageService.add({
        severity: 'success',
        detail: `${ this.collectionNameTranslated } ${ $localize`updated` }`
      });
    } catch (error) {
      this.loggerService.error(new DatabaseError(
        this.collectionName,
        (error as Error).message,
        document
      ));
    }
    return await this.findOneById(document.id);
  }

  public async removeOne(document: HasIdInterface): Promise<void> {
    if (!document.id) {
      throw new EmptyDocumentIdError(this.collectionName, document);
    }

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await deleteDoc(ref);
      this.messageService.add({
        severity: 'success',
        summary: `${ this.collectionNameTranslated } ${ $localize`deleted` }`
      });
    } catch (error) {
      this.loggerService.error(new DatabaseError(
        this.collectionName,
        (error as Error).message,
        document
      ));
    }
  }

  async getAll(orderByColumn = 'name'): Promise<M[]> {
    const documents = await this.queryList(orderBy(orderByColumn));
    return documents.map((document: HasIdWithInterface<B>) => new this.type(document));
  }

  /**
   * On récupère la liste des documents
   * @param queryConstraints
   * @private
   */
  protected async queryList(...queryConstraints: QueryConstraint[]): Promise<HasIdWithInterface<B>[]> {
    const q = query(this.ref, ...queryConstraints).withConverter(this.converter);
    const documents: HasIdWithInterface<B>[] = [];

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((docSnapshot) => {
        documents.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });

    } catch (e) {
      const error = e as Error;

      if (error.message === 'Quota exceeded.') {
        this.loggerService.error(new QuotaExceededError());
      } else {
        throw e;
      }
    }

    return documents;
  }


}
