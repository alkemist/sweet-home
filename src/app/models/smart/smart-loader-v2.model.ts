import {computed, DestroyRef, Signal, signal} from "@angular/core";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";

export class LoaderModel {
	private _terminated = signal(false);

	constructor(protected _id: number, protected timing: number = 0) {
		//console.log(`-- [Loader Signal ${ this.id }] New`, this.timing);
	}

	get id() {
		return this._id;
	}

	get terminated(): Signal<boolean> {
		return this._terminated.asReadonly();
	}

	start() {
		//console.log(`-- [Loader Signal ${ this.id }] Start`);

		if (this.timing > 0) {
			setTimeout(() => {
				this.finish();
			}, this.timing);
		}
	}

	finish() {
		//console.log(`-- [Loader Signal ${ this.id }] End`);
		this._terminated.set(true);
	}
}

export class SmartLoaderModel {
	private readonly _loading;
	private readonly _loaders
	;

	constructor(destroyRef?: DestroyRef) {
		this._loaders = signal<LoaderModel[]>([]);

		this._loading = computed(() =>
			this._loaders().length > 0 &&
			this._loaders()
				.filter(loader => !loader.terminated())
				.length > 0
		);

		toObservable(this._loading)
			.pipe(takeUntilDestroyed(destroyRef))
			.subscribe((loading) => {
				if (!loading) {
					this._loaders.set([]);
				}
			});
	}

	loading(): Signal<boolean> {
		return this._loading;
	}

	addLoader(timing: number = 0): LoaderModel {
		const loader = new LoaderModel(this._loaders().length + 1, timing);
		this._loaders.mutate(loaders => loaders.push(loader));

		if (timing > 0) {
			loader.start();
		}

		return loader;
	}
}