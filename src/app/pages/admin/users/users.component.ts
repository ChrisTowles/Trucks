import {Component, OnInit} from '@angular/core';
import {User} from '@app/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  private userCollection: AngularFirestoreCollection<User>;
  users: User[] = [];

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.userCollection = this.afs.collection<User>('users');
    this.userCollection.snapshotChanges()
      .subscribe(actions => {
        this.users = actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });

  }

  saveUser(user: User) {
    this.userCollection.doc(user.id).update({admin: user.admin});
  }
}
