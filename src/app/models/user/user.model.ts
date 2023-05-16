import {UserInterface, UserStoredInterface} from "./user.interface";
import {DocumentModel} from "../document";
import {OauthTokensModel} from "../oauth";


export class UserModel extends DocumentModel {
	protected _email: string;
	protected _jeedom: string;
	protected _sonos: OauthTokensModel;
	protected _spotify: OauthTokensModel;
	protected _google: OauthTokensModel;

	constructor(user: UserStoredInterface) {
		super(user);
		this._email = user.email ?? "";
		this._jeedom = user.jeedom ?? "";
		this._spotify = new OauthTokensModel(user.spotify ?? {});
		this._sonos = new OauthTokensModel(user.sonos ?? {});
		this._google = new OauthTokensModel(user.google ?? {});
	}

	get jeedom(): string {
		return this._jeedom;
	}

	get sonos() {
		return this._sonos;
	}

	set sonos(oauthToken: OauthTokensModel) {
		this._sonos = oauthToken;
	}

	get spotify() {
		return this._spotify;
	}

	set spotify(oauthToken: OauthTokensModel) {
		this._spotify = oauthToken;
	}

	get google() {
		return this._google;
	}

	set google(oauthToken: OauthTokensModel) {
		this._google = oauthToken;
	}

	override toFirestore(): UserInterface {
		return {
			...super.toFirestore(),
			email: this._email,
			jeedom: this._jeedom,
			spotify: this._spotify.toFirestore(),
			sonos: this._sonos.toFirestore(),
		};
	}
}
