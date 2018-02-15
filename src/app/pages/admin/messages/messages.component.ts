import {Component, OnInit} from '@angular/core';
import {Message, MessageId} from '@app/shared';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  private messageCollection: AngularFirestoreCollection<Message>;
  messages: MessageId[] = [];

  constructor(private afs: AngularFirestore) {
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
