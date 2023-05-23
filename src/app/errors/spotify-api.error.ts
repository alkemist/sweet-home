import {HttpErrorResponse} from "@angular/common/http";
import {ApiError} from "./api.error";

export class SpotifyApiError extends ApiError {
	constructor(url: string, params: any, error: HttpErrorResponse) {
		super("spotify", error, `Api "${url}"`, params);
	}
}
