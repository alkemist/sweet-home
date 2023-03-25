import { combineLatest, map, Subject, switchMap } from 'rxjs';

export class LoaderModel extends Subject<number> {
  constructor(private id: number) {
    super();
  }

  finish() {
    this.next(this.id);
  }
}

export class SmartLoaderModel {
  private loaders: LoaderModel[] = [];
  private _dynamicObservables$ = new Subject<LoaderModel[]>()
  private _globalLoader$ = new Subject<boolean>();

  constructor() {

  }

  get globalLoader() {
    return this._globalLoader$.asObservable();
  }

  get allLoaders() {
    return this._dynamicObservables$.pipe(
      switchMap(obsList => {
        return combineLatest(obsList);
      }),
      map((values) => {
        this.loaders = [];
        this._globalLoader$.next(false);
        return values;
      })
    );
  }

  addLoader(): LoaderModel {
    if (this.loaders.length === 0) {
      this._globalLoader$.next(true);
    }

    const loader = new LoaderModel(this.loaders.length + 1);
    this.loaders.push(loader);
    this._dynamicObservables$.next(this.loaders);
    return loader;
  }
}
