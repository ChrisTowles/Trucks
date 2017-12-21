import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Equipment, EquipmentId} from '../core/equipment.model';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private inventoryCollection: AngularFirestoreCollection<Equipment>;
  inventory: Observable<EquipmentId[]>;

  constructor(private afs: AngularFirestore,
              private router: Router) {

    this.inventoryCollection = afs.collection<Equipment>('inventory');
    this.inventory = this.inventoryCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Equipment;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  ngOnInit() {
  }

}
