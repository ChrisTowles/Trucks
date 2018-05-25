import * as functions from 'firebase-functions';

import {commercialTruckTraderApp} from './commercial-truck-trader';
import {messageCreateApp} from './messages';
import {siteMapApp} from './sitemap';

export const sitemap = functions.https.onRequest(siteMapApp);
export const ctt = functions.https.onRequest(commercialTruckTraderApp);
export const sendMessageCreateEmail = functions.firestore.document('messages/{messageId}').onCreate(messageCreateApp);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
