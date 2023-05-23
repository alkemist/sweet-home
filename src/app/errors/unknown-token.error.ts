import {UserError} from "./user.error";

export class UnknownTokenError extends UserError {
	constructor(routeParams: any, queryParams: any) {
		super();
		this.message = `No token`;
		this.context = {
			routeParams, queryParams
		};
	}
}
