import { FirestoreService } from '@app/services/firestore.service';
import { DocumentInterface, DocumentModel } from '@models';
import { LoggerService } from '@services';
import { first, Observable } from 'rxjs';
import { ArrayHelper, TimeHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { Store } from '@ngxs/store';
import { DocumentNotFoundError } from '@errors';
import { AddDocument, FillDocuments, RemoveDocument, UpdateDocument } from '@app/stores/document.action';

export abstract class DataStoreService<T extends DocumentInterface, U extends DocumentModel> extends FirestoreService<T, U> {
  // Heritage du selecteur du store
  protected lastUpdated$?: Observable<Date>;
  // Heritage du selecteur du store
  protected all$?: Observable<T[]>;
  // Données du service
  protected all: U[] = [];
  protected lastUpdated?: Date;
  protected maxHourOutdated = 24;
  protected loaded: boolean = false;

  protected constructor(loggerService: LoggerService,
                        collectionName: string,
                        type: (new (data: T) => U),
                        protected store: Store,
                        protected addAction: (new (payload: T) => AddDocument<T>),
                        protected updateAction: (new (payload: T) => UpdateDocument<T>),
                        protected removeAction: (new (payload: T) => RemoveDocument<T>),
                        protected fillAction: (new (payload: T[]) => FillDocuments<T>),
  ) {
    super(loggerService, collectionName, type);
    this.initLastUpdated();
  }

  initLastUpdated() {
    this.getLastUpdated$()?.subscribe(lastUpdated => {
      this.lastUpdated = lastUpdated;
    });
  }

  getAll$(): Observable<T[]> | undefined {
    return this.all$;
  }

  getLastUpdated$() {
    return this.lastUpdated$;
  }

  storeIsOutdated(): boolean {
    if (this.lastUpdated === undefined) {
      return true;
    }
    const nbHours = TimeHelper.calcHoursAfter(this.lastUpdated);
    return nbHours >= this.maxHourOutdated;
  }

  async getListOrRefresh(): Promise<U[]> {
    return new Promise<U[]>(async resolve => {
      // Si les données ont déjà été chargé dans le service
      if (this.loaded) {
        resolve(this.all);
      }
      // Sinon, si des données à jour sont dans le store
      else if (this.all$ && !this.storeIsOutdated()) {
        this.getAll$()?.pipe(first()).subscribe(async documents => {
          this.refreshList(documents);
          this.loaded = true;
          resolve(this.all);
        })
      }
      // Sinon on rafraichit le store
      else {
        const documents = await super.queryList(orderBy('name'));
        this.store.dispatch(new this.fillAction(documents));

        this.refreshList(documents);
        this.loaded = true;
        resolve(this.all);
      }
    });
  }

  refreshList(documents: T[]): U[] {
    this.all = [];
    for (const document of documents) {
      this.all.push(new this.type(document));
    }
    this.all = ArrayHelper.sortBy<U>(this.all, 'slug');
    return this.all;
  }

  async search(query: string): Promise<U[]> {
    const documents = await this.getListOrRefresh();
    return documents.filter((document: U) => {
      return document.nameContain(query);
    });
  }

  async add(document: T): Promise<T | undefined> {
    const documentStored = await super.addOne(document);
    return await this.addToStore(documentStored);
  }

  async addToStore(documentStored: T): Promise<T> {
    this.store.dispatch(new this.addAction(documentStored));
    return documentStored;
  }

  async update(document: T): Promise<T | undefined> {
    const documentStored = await super.updateOne(document);
    this.store.dispatch(new this.updateAction(documentStored));
    return documentStored;
  }

  async remove(document: T): Promise<void> {
    await super.removeOne(document);
    this.store.dispatch(new this.removeAction(document));
  }

  getById(id: string, forceRefresh = false) {
    return this.getBy('id', id, forceRefresh)
  }

  getBySlug(slug: string, forceRefresh = false) {
    return this.getBy('slug', slug, forceRefresh)
  }

  /** La variable "all" n'est plus à jour et doit être rechargé */
  protected invalidLocalData() {
    this.loaded = false;
  }

  private async getBy(property: 'id' | 'slug', value: string, forceRefresh = false): Promise<U | undefined> {
    if (!value) {
      return undefined;
    }

    const documents = await this.getListOrRefresh();
    const document = documents.find((document: U) => {
      return document[property] === value;
    })!;

    if (!document || forceRefresh) {
      try {
        const documentData = await super.findOneBy(property, value);

        await this.addToStore(documentData);
        this.invalidLocalData();

        return new this.type(documentData);
      } catch (e) {
        if (e instanceof DocumentNotFoundError) {
          return undefined;
        }
      }
    }

    return document;
  }
}
