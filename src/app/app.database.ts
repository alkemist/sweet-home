import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { isDevMode } from '@angular/core';

const app = initializeApp({
  apiKey: process.env['FIREBASE_API_KEY'],
  authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
  projectId: process.env['FIREBASE_PROJECT_ID'],
  storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
  appId: process.env['FIREBASE_APP_ID'],
});

if (!isDevMode() && !parseInt(process.env['APP_OFFLINE'] ?? '0')) {
  getAnalytics(app);
}
