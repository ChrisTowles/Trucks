import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Message, MessageId} from '../core/message.model';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  private messageCollection: AngularFirestoreCollection<Message>;
  messages: MessageId[] = [];

  constructor(private afs: AngularFirestore,
              private meta: Meta,
              private title: Title) {

    this.title.setTitle('Craigmyle Trucks - Admin');
    this.meta.addTags([
      {name: 'description', content: 'Admin Page for Craigmyle Trucks'},
      {name: 'og:title', content: 'Craigmyle Trucks - Admin'},
      {name: 'og:description', content: 'Admin Page for Craigmyle Trucks'},
      {name: 'og:type', content: 'website'}
    ]);
  }

  ngOnInit() {

    this.messageCollection = this.afs.collection<Message>('messages');
    this.messageCollection.snapshotChanges()
      .subscribe(actions => {
        this.messages = actions.map(a => {
          const data = a.payload.doc.data() as Message;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });


  }

  messageRead(msg) {
    this.messageCollection.doc(msg.id).update({read: true});
  }

  messageUnread(msg) {
    this.messageCollection.doc(msg.id).update({read: false});
  }


  messageDelete(msg) {
    this.messageCollection.doc(msg.id).delete();
  }

  encodeURI(str: string) {
    return encodeURI(str);
  }
}
