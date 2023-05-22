import {environment} from "../environments/environment";
import {initializeApp} from "firebase/app";
import {isDevMode} from "@angular/core";
import {getAnalytics} from "firebase/analytics";

const app = initializeApp({
	apiKey: environment["FIREBASE_API_KEY"],
	authDomain: environment["FIREBASE_AUTH_DOMAIN"],
	projectId: environment["FIREBASE_PROJECT_ID"],
	storageBucket: environment["FIREBASE_STORAGE_BUCKET"],
	messagingSenderId: environment["FIREBASE_MESSAGING_SENDER_ID"],
	appId: environment["FIREBASE_APP_ID"],
});

if (!isDevMode() && !parseInt(environment["APP_OFFLINE"] ?? "0") && typeof window["cordova"] === "undefined") {
	getAnalytics(app);
}

