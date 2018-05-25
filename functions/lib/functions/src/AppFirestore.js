"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions = require("firebase-functions");
class AppFirestore {
    static getInstance() {
        if (!AppFirestore.instance) {
            admin.initializeApp(functions.config().firebase);
            AppFirestore.instance = admin.firestore();
        }
        return AppFirestore.instance;
    }
}
exports.AppFirestore = AppFirestore;
//# sourceMappingURL=AppFirestore.js.map