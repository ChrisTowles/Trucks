import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

export class AppFirestore {
  public static instance: admin.firestore.Firestore;

  public static getInstance(): admin.firestore.Firestore {
    if (!AppFirestore.instance) {
      admin.initializeApp(functions.config().firebase);
      AppFirestore.instance = admin.firestore();
    }
    return AppFirestore.instance;
  }

}
