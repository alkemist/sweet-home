import {computed, effect, signal} from "@angular/core";

export class LoaderSignalModel {
	private _terminated = signal(false);

	constructor(protected _id: number, protected timing: number = 0) {
		//console.log(`-- [Loader Signal ${ this.id }] New`, this.timing);
	}

	get id() {
		return this._id;
	}

	get terminated() {
		return this._terminated();
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

export class SmartLoaderSignalModel {
	private readonly _terminated;
	private readonly _loaders
	;

	constructor() {
		this._loaders = signal<LoaderSignalModel[]>([]);

		this._terminated = computed(() =>
			this._loaders().length > 0 &&
			this._loaders()
				.filter(loader => !loader.terminated)
				.length > 0
		);

		effect(() => {
			if (!this._terminated()) {
				this._loaders.set([]);
			}
		}, {allowSignalWrites: true});
	}

	terminated() {
		return this._terminated();
	}

	addLoader(timing: number = 0): LoaderSignalModel {
		const loader = new LoaderSignalModel(this._loaders().length + 1, timing);
		this._loaders.mutate(loaders => loaders.push(loader));

		if (timing > 0) {
			loader.start();
		}

		return loader;
	}
}