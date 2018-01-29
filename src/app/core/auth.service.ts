import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

export interface UserBasic {
  id: string;
  email: string;
  photoURL?: string;
  displayName?: string;
}

export interface User extends UserBasic {
  admin: boolean;
}

@Injectable()
export class AuthService {
  user: Observable<User>;


  constructor(private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {

    // Listen for authState changes
    this.user = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          /// not signed in
          return Observable.of(null);
        }
      });
  }

  signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');
    return this.oAuthLogin(googleProvider);

  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithRedirect(provider)
      .then(cred => {
        this.updateUserData(cred);
      });
  }


  logout() {
    this.afAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);

    const data: UserBasic = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.snapshotChanges()
      .take(1)
      .map(doc => {
        if (doc.payload.exists) {
          const oldData = doc.payload.data() as User;
          const roleData = {admin: oldData.admin};
          return userRef.set({...data, ...roleData});
        } else {
          return userRef.set({...data});
        }
      });
  }

  isAdmin(): Observable<boolean> {
    return this.user
      .take(1)
      .map(user => {
        if (user) {
          return user.admin;
        }
        return false;
      });
  }
}

