"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const commercial_truck_trader_1 = require("./commercial-truck-trader");
const messages_1 = require("./messages");
const sitemap_1 = require("./sitemap");
exports.sitemap = functions.https.onRequest(sitemap_1.siteMapApp);
exports.ctt = functions.https.onRequest(commercial_truck_trader_1.commercialTruckTraderApp);
exports.sendMessageCreateEmail = functions.firestore.document('messages/{messageId}').onCreate(messages_1.messageCreateApp);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
//# sourceMappingURL=index.js.map