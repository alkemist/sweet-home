import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject, filter, map, Observable, of} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {OauthTokenModel, OauthTokensModel, UserInterface, UserModel} from "@models";
import {InvalidEmailError, OfflineError, TooManyRequestError, UserNotExistError, WrongApiKeyError, WrongPasswordError} from "@errors";
import {LoggerService} from "./logger.service";
import {
	getAuth,
	isSignInWithEmailLink,
	onAuthStateChanged,
	sendSignInLinkToEmail,
	signInWithEmailAndPassword,
	signInWithEmailLink,
	signInWithPopup,
	signOut,
	User,
  GoogleAuthProvider
} from "firebase/auth";
import {MessageService} from "primeng/api";
import {JsonService} from "./json.service";
import {FirebaseAuthError} from "../errors/firebase-auth.error";
import {Router} from "@angular/router";
import {DOCUMENT} from "@angular/common";

export type AppKey = "sonos" | "spotify" | "google";

@Injectable({
	providedIn: "root"
})
export class UserService extends FirestoreService<UserInterface, UserModel> {
	private auth = getAuth();
	private _isLoggedIn: BehaviorSubject<boolean | null>;
	private _user: UserModel | null = null;

	constructor(
		messageService: MessageService,
		loggerService: LoggerService,
		jsonService: JsonService,
		protected router: Router,
    @Inject(DOCUMENT) document: Document
	) {
		super(messageService, loggerService, jsonService, "user", $localize`User`, UserModel);
		this._isLoggedIn = new BehaviorSubject<boolean | null>(null);

		if (parseInt(process.env["APP_OFFLINE"] ?? "0")) {
			this._user = new UserModel({
				id: "",
				name: "",
				email: "",
				slug: "",
				jeedom: "",
			});
		}

		onAuthStateChanged(this.auth, (userFirebase) => {
			if (parseInt(process.env["APP_OFFLINE"] ?? "0")) {
				this._isLoggedIn.next(true);
				return;
			}

			if (!userFirebase) {
				this._isLoggedIn.next(false);
			} else {
				void this.getUser(userFirebase);
			}
		});
	}

	get user() {
		return this._user as UserModel;
	}

	isLoggedIn(): Observable<boolean> {
		if (this._user) {
			return of(true);
		}

		return this._isLoggedIn.asObservable().pipe(
			filter((isLoggedIn) => isLoggedIn !== null),
			map((isLoggedIn) => !!isLoggedIn)
		);
	}

	getJeedomApiKey(): string {
		return this.user.jeedom;
	}

	getToken(appKey: AppKey): OauthTokensModel {
		return this.user[appKey];
	}

	login(email: string, password: string): Promise<void> {
		return signInWithEmailAndPassword(this.auth, email, password)
			.then((userCredential) => this.getUser(userCredential.user))
			.catch((error) => {
				if (error.code === "auth/invalid-email") {
					throw new InvalidEmailError();
				} else if (error.code === "auth/wrong-password" || error.code === "auth/_user-not-found") {
					throw new WrongPasswordError();
				} else if (error.code === "auth/too-many-requests") {
					throw new TooManyRequestError();
				} else if (error.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
					throw new WrongApiKeyError();
				} else if (error.code === "auth/network-request-failed") {
					throw new OfflineError();
				} else {
					console.error($localize`Unknown error code`, `"${error.code}"`);
				}
			});
	}

	sendLoginLink(email: string) {
		return sendSignInLinkToEmail(this.auth, email, {
			// URL you want to redirect back to. The domain (www.example.com) for this
			// URL must be in the authorized domains list in the Firebase Console.
			url: `/authorize`, //${this.document.location.origin}
			// This must be true.
			handleCodeInApp: true,
			android: {
				packageName: "com.alkemist.sweethome",
				installApp: true,
			},
		})
			.then(() => {

			})
			.catch((error) => {
				this.loggerService.error(new FirebaseAuthError(error));
			});
	}

	isSignInWithEmailLink() {
		return isSignInWithEmailLink(this.auth, window.location.href);
	}

	loginWithLink() {
		let email = window.localStorage.getItem("emailForSignIn");

		if (email) {
			try {
				return signInWithEmailLink(this.auth, email, window.location.href)
					.then((userCredential) => this.getUser(userCredential.user));
			} catch (error) {
				const customError = new FirebaseAuthError(error);
				this.loggerService.error(customError);
				return Promise.reject(error);
			}
		} else {
			const customError = new InvalidEmailError();
			this.loggerService.error(customError);
			return Promise.reject(customError);
		}
	}

	loginWithProvider() {
		return signInWithPopup(this.auth, new GoogleAuthProvider())
			.then((result) => {
				console.log(result);
				/*const credential = GoogleAuthProvider.credential(result);
				if (credential.accessToken) {
					void this.updateRefreshToken("google", new OauthTokenModel({
						token: credential.accessToken,
						token_type: "Bearer",
					}));
				}*/
			})
			.catch((error) => {
				const customError = new FirebaseAuthError(error);
				this.loggerService.error(customError);
				return Promise.reject(error);
			});
	}

	async logout(): Promise<void> {
		this._user = null;
		this._isLoggedIn.next(false);
		return signOut(this.auth);
	}

	updateRefreshToken(type: AppKey, oauthToken: OauthTokenModel) {
		if (this._user) {
			this._user[type].setRefreshToken(oauthToken);
			return this.updateOne(this._user);
		}
		return Promise.reject();
	}

	updateAccessToken(type: AppKey, oauthToken: OauthTokenModel) {
		if (this._user) {
			this._user[type].setAccessToken(oauthToken);
			return this.updateOne(this._user);
		}
		return Promise.reject();
	}

	private getUser(userFirebase: User) {
		window.localStorage.removeItem("emailForSignIn");

		return this.findOneById(userFirebase.uid).then((dataUser) => {
			if (!dataUser) {
				this._isLoggedIn.next(false);
				this.loggerService.error(new UserNotExistError());
				return;
			}

			this._user = new UserModel(dataUser);
			// console.log('-- Logged with', dataUser);
			this._isLoggedIn.next(true);
		});
	}
}
