import {UserError} from "./user.error";

export class FirebaseAuthError extends UserError {
	constructor(public override context?: any) {
		super();
	}
}
