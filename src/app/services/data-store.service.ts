import { FirestoreService } from '@app/services/firestore.service';
import { DocumentModel, DocumentStoredInterface } from '@models';
import { LoggerService } from '@services';
import { first, Observable } from 'rxjs';
import { ArrayHelper, TimeHelper } from '@tools';
import { orderBy } from 'firebase/firestore';
import { Store } from '@ngxs/store';
import { DocumentNotFoundError } from '@errors';
import {
  AddDocument,
  FillDocuments,
  InvalideDocuments,
  RemoveDocument,
  UpdateDocument
} from '@app/stores/document.action';
import { HasIdWithInterface } from '@app/models/id.interface';

export abstract class DataStoreService<
  S extends DocumentStoredInterface,
  M extends DocumentModel
> extends FirestoreService<S, M> {

  // Heritage du selecteur du store
  protected lastUpdated$?: Observable<Date>;
  // Heritage du selecteur du store
  protected all$?: Observable<S[]>;
  // Données du service
  protected all: M[] = [];
  protected lastUpdated?: Date;
  protected maxHourOutdated = 24;
  protected loaded: boolean = false;

  protected constructor(loggerService: LoggerService,
                        collectionName: string,
                        type: (new (data: S) => M),
                        protected store: Store,
                        protected addAction: (new (payload: S) => AddDocument<S>),
                        protected updateAction: (new (payload: S) => UpdateDocument<S>),
                        protected removeAction: (new (payload: HasIdWithInterface<S>) => RemoveDocument<S>),
                        protected fillAction: (new (payload: S[]) => FillDocuments<S>),
                        protected invalideAction: (new () => InvalideDocuments<S>),
  ) {
    super(loggerService, collectionName, type);
    this.initLastUpdated();
  }

  initLastUpdated() {
    this.getLastUpdated$()?.subscribe(lastUpdated => {
      this.lastUpdated = lastUpdated;
    });
  }

  getAll$(): Observable<S[]> | undefined {
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

  async getListOrRefresh(): Promise<M[]> {
    return new Promise<M[]>(async resolve => {
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

  refreshList(documents: S[]): M[] {
    this.all = [];
    for (const document of documents) {
      this.all.push(new this.type(document));
    }
    this.all = ArrayHelper.sortBy<M>(this.all, 'slug');
    return this.all;
  }

  async search(query: string): Promise<M[]> {
    const documents = await this.getListOrRefresh();
    return documents.filter((document: M) => {
      return document.nameContain(query);
    });
  }

  async add(document: M): Promise<S> {
    const documentStored = await super.addOne(document);
    this.invalidLocalData();
    return await this.addToStore(documentStored);
  }

  async addToStore(documentStored: S): Promise<S> {
    this.store.dispatch(new this.addAction(documentStored));
    return documentStored;
  }

  async update(document: M): Promise<S> {
    const documentStored = await super.updateOne(document);
    this.invalidLocalData();
    this.store.dispatch(new this.updateAction(documentStored));
    return documentStored;
  }

  async remove(document: HasIdWithInterface<S>): Promise<void> {
    await super.removeOne(document);
    this.invalidLocalData();
    this.store.dispatch(new this.removeAction(document));
  }

  getById(id: string, forceRefresh = false) {
    return this.getBy('id', id, forceRefresh)
  }

  getBySlug(slug: string, forceRefresh = false) {
    return this.getBy('slug', slug, forceRefresh)
  }

  async invalidStoredData() {
    this.store.dispatch(new this.invalideAction());
  }

  /** La variable "all" n'est plus à jour et doit être rechargé */
  protected invalidLocalData() {
    this.loaded = false;
  }

  private async getBy(property: 'id' | 'slug', value: string, forceRefresh = false): Promise<M | undefined> {
    if (!value) {
      return undefined;
    }

    const documents = await this.getListOrRefresh();
    const document = documents.find((document: M) => {
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
