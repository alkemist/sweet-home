import { DocumentModel, DocumentStoredInterface, HasIdInterface, HasIdWithInterface } from "@models";
import { LoggerService } from "@services";
import { first, Observable } from "rxjs";
import { ArrayHelper, TimeHelper } from "@tools";
import { orderBy } from "firebase/firestore";
import { Store } from "@ngxs/store";
import { DocumentNotFoundError } from "@errors";
import {
  AddDocument,
  FillDocuments,
  InvalideDocuments,
  RemoveDocument,
  UpdateDocument
} from "../stores/document.action";
import { FirestoreService } from "./firestore.service";
import { MessageService } from "primeng/api";
import { JsonService } from "./json.service";
import { environment } from "../../environments/environment";
import { signal } from '@angular/core';

export abstract class DatastoreService<
  I extends DocumentStoredInterface,
  M extends DocumentModel
> extends FirestoreService<I, M> {

  // Heritage du selecteur du store
  protected lastUpdated$?: Observable<Date>;
  // Heritage du selecteur du store
  protected all$?: Observable<I[]>;
  // Données du service
  protected all: M[] = [];
  protected lastUpdated?: Date;
  protected maxHourOutdated = 24;
  protected loaded: boolean = false;
  
  protected signalLastUpdated = signal<Date | null>(null);
  protected signallAll = signal<I[]>([]);

  protected constructor(messageService: MessageService,
                        protected override loggerService: LoggerService,
                        jsonService: JsonService,
                        collectionName: string,
                        collectionNameTranslated: string,
                        type: (new (data: I) => M),
                        protected store: Store,
                        //protected stateManager: StateManager,
                        protected addAction: (new (payload: I) => AddDocument<I>),
                        protected updateAction: (new (payload: I) => UpdateDocument<I>),
                        protected removeAction: (new (payload: HasIdInterface) => RemoveDocument<HasIdInterface>),
                        protected fillAction: (new (payload: I[]) => FillDocuments<I>),
                        protected invalideAction: (new () => InvalideDocuments<I>),
                        /*protected addAction2: (new (payload: I) => AddDocument<I>),
                        protected updateAction2: (new (payload: I) => UpdateDocument<I>),
                        protected removeAction2: (new (payload: HasIdInterface) => RemoveDocument<HasIdInterface>),
                        protected fillAction2: (new (payload: I[]) => FillDocuments<I>),
                        protected invalideAction2: (new () => InvalideDocuments<I>),*/
  ) {
    super(messageService, loggerService, jsonService, collectionName, collectionNameTranslated, type);
    this.initLastUpdated();
  }

  initLastUpdated() {
    this.getLastUpdated$()?.subscribe(lastUpdated => {
      this.lastUpdated = lastUpdated;
    });
  }

  getAll$(): Observable<I[]> | undefined {
    return this.all$;
  }

  getLastUpdated$() {
    return this.lastUpdated$;
  }

  storeIsOutdated(): boolean {
    if (environment["APP_OFFLINE"]) {
      return false;
    }
    if (this.lastUpdated === undefined || this.lastUpdated === null) {
      return true;
    }

    const nbHours = TimeHelper.calcHoursAfter(this.lastUpdated);
    return nbHours >= this.maxHourOutdated;
  }

  async getListOrRefresh(): Promise<M[]> {
    //console.log(`[${ this.collectionName }] Get list or refresh`, this.loaded, this.storeIsOutdated())

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
        });
      }
      // Sinon on rafraichit le store
      else {
        const documents = await super.queryList(orderBy("name"));
        this.store.dispatch(new this.fillAction(documents));

        this.refreshList(documents);
        this.loaded = true;
        resolve(this.all);
      }
    });
  }

  refreshList(documents: I[]): M[] {
    this.all = [];
    for (const document of documents) {
      this.all.push(new this.type(document));
    }
    this.all = ArrayHelper.sortBy<M>(this.all, "slug");
    return this.all;
  }

  async search(query: string): Promise<M[]> {
    const documents = await this.getListOrRefresh();
    return documents.filter((document: M) => {
      return document.nameContain(query);
    });
  }

  async add(document: M): Promise<I> {
    const documentStored = await super.addOne(document);
    this.invalidLocalData();
    return await this.addToStore(documentStored);
  }

  async addToStore(documentStored: I): Promise<I> {
    this.store.dispatch(new this.addAction(documentStored));
    return documentStored;
  }

  async update(document: M): Promise<I> {
    const documentStored = await super.updateOne(document);
    this.invalidLocalData();
    this.store.dispatch(new this.updateAction(documentStored));
    return documentStored;
  }

  async remove(document: HasIdWithInterface<M>): Promise<void> {
    await super.removeOne(document);
    this.invalidLocalData();
    this.store.dispatch(new this.removeAction(document));
  }

  getById(id: string, forceRefresh = false) {
    return this.getBy("id", id, forceRefresh);
  }

  getBySlug(slug: string, forceRefresh = false) {
    return this.getBy("slug", slug, forceRefresh);
  }

  async invalidStoredData() {
    this.store.dispatch(new this.invalideAction());
    this.messageService.add({
      severity: "success",
      detail: `${ this.collectionNameTranslated } ${ $localize`store cleaned` }`
    });
  }

  /** La variable "all" n'est plus à jour et doit être rechargé */
  protected invalidLocalData() {
    this.loaded = false;
  }

  private async getBy(property: "id" | "slug", value: string, forceRefresh = false): Promise<M | undefined> {
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
