import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Message, MessageId} from '../message.model';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})

export class NavComponent {
  navbarCollapsed = true;
  searchForm: FormGroup;
  private messageCollection: AngularFirestoreCollection<Message>;
  messages: MessageId[] = [];

  constructor(private router: Router,
              private fb: FormBuilder,
              public authService: AuthService,
              private afs: AngularFirestore) {
    // this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
    //   this.progressBarMode = mode;
    // });
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
    this.router.navigate(['/inventory'], {queryParams: {search: text}});
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
      })
      .catch((err) => console.log(err));
  }
}
