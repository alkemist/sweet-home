import {FirebaseError} from "./firebase.error";

export class FirebaseAuthError extends FirebaseError {
	constructor(public override context?: any) {
		super();
	}
}
