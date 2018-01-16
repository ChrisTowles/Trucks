import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';
import {User} from './user';
import {AngularFirestore} from 'angularfire2/firestore';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import * as _ from 'lodash';

@Injectable()
export class AuthService {
  user: Observable<User> = null;
  userRoles: Array<string>;

  constructor(private afs: AngularFirestore,
              private firebaseAuth: AngularFireAuth,
              private router: Router) {

    // Listen for authState changes
    this.firebaseAuth.authState
      .switchMap(auth => {
        if (auth) {
          /// signed in
          return this.updateUser(auth)
            .do(x => {
              this.userRoles = _.keys(_.pickBy(x.roles));
            });
        } else {
          /// not signed in
          return Observable.of(null);
        }
      })
      .do(user => {

      })
      .subscribe(user => {
        this.user = user;
      });
  }

  signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('email');

    return this.firebaseAuth.auth.signInWithRedirect(googleProvider)
      .then(cred => {
        this.updateUser(cred);
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }

  /// updates database with user info after login
  /// only runs if user role is not already defined in database
  private updateUser(authData): Observable<User> {
    const userData = new User(authData);
    const userDoc = this.afs.doc<User>('users/' + authData.uid);

    return userDoc.snapshotChanges()
      .take(1)
      .map(doc => {
        if (!doc.payload.exists) {
          userDoc.set({...userData});
          return userData;
        } else {
          return doc.payload.data() as User;
        }
      });
  }

  isLoggedIn() {
    return this.user !== null;
  }

  isAdmin(): boolean {
    const allowed = ['admin'];
    return this.isLoggedIn() && this.matchingRole(allowed);
  }

  // Determine if any matching roles exist
  private matchingRole(allowedRoles): boolean {
    return !_.isEmpty(_.intersection(allowedRoles, this.userRoles));
  }
}
