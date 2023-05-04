import {combineLatest, map, Subject, switchMap} from 'rxjs';

export class LoaderModel extends Subject<number> {
  constructor(protected loaderId: string, protected _id: number, protected timing?: number) {
    super();
  }

  private _terminated = false;

  get terminated() {
    return this._terminated;
  }

  get id() {
    return this._id;
  }

  start() {
    setTimeout(() => {
      this.finish();
    }, this.timing)
  }

  finish() {
    // console.log(`-- [Loader ${ this.loaderId }] End`, this._id);
    this._terminated = true;
    this.next(this._id);
  }
}

export class SmartLoaderModel {
  private loaders: LoaderModel[] = [];
  private _dynamicObservables$ = new Subject<LoaderModel[]>()

  constructor(private id: string) {

  }

  private _globalLoader$ = new Subject<boolean>();

  // Envoi "vrai" au premier loader
  // Envoi "faux" quand tout les loaders ont terminés
  get globalLoader$() {
    return this._globalLoader$.asObservable();
  }

  // Envoi tout les loaders quand ils sont tous terminés
  get allLoaders$() {
    return this._dynamicObservables$.pipe(
      switchMap(obsList => {
        return combineLatest(obsList);
      }),
      map((values) => {
        this.loaders = [];
        // console.log(`-- [Loader ${ this.id }] End`);
        this._globalLoader$.next(false);
        return values;
      })
    );
  }

  addLoader(timing?: number): LoaderModel {
    if (this.loaders.length === 0) {
      // console.log(`-- [Loader ${ this.id }] Start`);
      this._globalLoader$.next(true);
    }

    const loader = new LoaderModel(this.id, this.loaders.length + 1, timing);
    this.loaders.push(loader);

    const allUnterminatedLoaders = this.loaders.filter((loader) => !loader.terminated);
    this._dynamicObservables$.next(allUnterminatedLoaders);

    // console.log(`-- [Loader ${ this.id }] add loader`, loader.id, '/', allUnterminatedLoaders.length);

    if (timing) {
      loader.start();
    }

    return loader;
  }
}
