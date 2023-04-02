import { Handler, schedule } from '@netlify/functions';
import { Response } from '@netlify/functions/dist/function/response';
import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';

config();

const scheduleHandler: Handler = async function (): Promise<Response> {
    initializeApp({
      apiKey: process.env['FIREBASE_API_KEY'],
      authDomain: process.env['FIREBASE_AUTH_DOMAIN'],
      projectId: process.env['FIREBASE_PROJECT_ID'],
      storageBucket: process.env['FIREBASE_STORAGE_BUCKET'],
      messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'],
      appId: process.env['FIREBASE_APP_ID'],
      measurementId: process.env['FIREBASE_MEASUREMENT_ID']
    });

    //const firestoreRef = getFirestore();
    //const devices = FirebaseHelper.select(firestoreRef, 'device');

    return {
      statusCode: 200,
    };
  }
;

const handler = schedule('@weekly', scheduleHandler);
export { handler };
