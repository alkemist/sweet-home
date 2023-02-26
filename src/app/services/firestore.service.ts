import { DatabaseError, DocumentNotFoundError, EmptyDocumentError, QuotaExceededError } from '@errors';
import { FirestoreDataConverter } from '@firebase/firestore';
import { DataObjectInterface } from '@models';
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
  query,
  QueryConstraint,
  setDoc,
  where,
} from 'firebase/firestore';


export abstract class FirestoreService<T extends DataObjectInterface> {
  private readonly collectionName: string;
  private readonly converter: FirestoreDataConverter<T>;
  private readonly ref: CollectionReference;
  private readonly loggerService: LoggerService;

  protected constructor(logger: LoggerService, collectionName: string, converter: FirestoreDataConverter<T>) {
    this.loggerService = logger;
    this.collectionName = collectionName;
    this.converter = converter;
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
    } catch (e) {
      if (e instanceof DocumentNotFoundError) {
        return false;
      }
    }
    return !!dataObjectDocument;
  }

  protected async findOneById(id: string): Promise<T> {
    let docSnapshot;
    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      docSnapshot = await getDoc(ref);
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, { id }));
    }

    if (!docSnapshot) {
      throw new DocumentNotFoundError<T>(this.collectionName);
    }

    const document = docSnapshot.data();

    if (!document) {
      throw new DocumentNotFoundError<T>(this.collectionName);
    }
    document.id = docSnapshot.id;

    return document;
  }

  protected async findOneBy(property: string, value: string): Promise<T> {
    let list: T[] = [];

    try {
      list = await this.queryList(where(property, '==', value));
    } catch (e) {
      this.loggerService.error(new DatabaseError((e as Error).message, { [property]: value }));
    }

    if (list.length === 0) {
      throw new DocumentNotFoundError<T>(this.collectionName);
    }
    return list[0];
  }

  protected async findOneBySlug(slug: string): Promise<T> {
    return this.findOneBy('slug', slug);
  }

  protected async addOne(document: T): Promise<T> {
    const id = generatePushID();
    this.updateSlug(document);

    try {
      const ref = doc(this.ref, id).withConverter(this.converter);
      await setDoc(ref, document);
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
    return await this.findOneById(id);
  }

  protected async updateOne(document: T): Promise<T> {
    if (!document.id) {
      throw new DocumentNotFoundError<T>(this.collectionName, document);
    }
    this.updateSlug(document);

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await setDoc(ref, document);
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
    return await this.findOneById(document.id);
  }

  protected async removeOne(document: T): Promise<void> {
    if (!document.id) {
      throw new DocumentNotFoundError<T>(this.collectionName, document);
    }

    try {
      const ref = doc(this.ref, document.id).withConverter(this.converter);
      await deleteDoc(ref);
    } catch (error) {
      this.loggerService.error(new DatabaseError((error as Error).message, document));
    }
  }

  /**
   * On récupère la liste des documents
   * @param queryConstraints
   * @private
   */
  protected async queryList(...queryConstraints: QueryConstraint[]): Promise<T[]> {
    const q = query(this.ref, ...queryConstraints).withConverter(this.converter);
    const documents: T[] = [];

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const document = doc.data();
        document.id = doc.id;
        documents.push(document);
      });

    } catch (e) {
      const er = e as Error;

      if (er.message === 'Quota exceeded.') {
        this.loggerService.error(new QuotaExceededError());
      } else {
        throw e;
      }
    }

    return documents;
  }

  private updateSlug(document: T) {
    if (!document.name) {
      throw new EmptyDocumentError(this.collectionName);
    }

    document.slug = slugify(document.name);
  }
}
