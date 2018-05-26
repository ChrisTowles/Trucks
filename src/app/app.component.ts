import {Component} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {Message, MessageId} from '@app/shared';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {AuthService} from '@app/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {

  navbarCollapsed = true;
  searchForm: FormGroup;
  private messageCollection: AngularFirestoreCollection<Message>;
  messages: MessageId[] = [];

  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
              private router: Router,
              private fb: FormBuilder,
              public authService: AuthService,
              private afs: AngularFirestore) {

    this.createForm();

    this.messageCollection = this.afs.collection<Message>('messages', ref => ref.where('read', '==', false));
    this.messageCollection.snapshotChanges()
      .subscribe(actions => {
        this.messages = actions.map(a => {
          const data = a.payload.doc.data() as Message;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });

  }


  search() {
    const text = this.searchForm.value.searchText;
    this.searchForm.setValue({searchText: ''});
    this.router.navigate(['/'], {queryParams: {search: text}});
  }


  createForm() {
    this.searchForm = this.fb.group({ // <-- the parent FormGroup
      searchText: ['', Validators.required],
    });
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
      .then((res) => {
        this.router.navigate(['']);
      });
  }

}
