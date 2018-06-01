import {Component, OnInit} from '@angular/core';
import {InventoryService} from '@app/core';
import {EquipmentOption, EquipmentOptionId} from '@app/shared';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {ToastService} from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-equipment-options',
  templateUrl: './equipment-options.component.html',
  styleUrls: ['./equipment-options.component.scss'],
})
export class EquipmentOptionsComponent implements OnInit {
  private equipmentOptionsCollection: AngularFirestoreCollection<EquipmentOption>;
  options: EquipmentOptionId[] = [];
  addText = '';

  constructor(private afs: AngularFirestore,
              private inventoryService: InventoryService,
              private toast: ToastService) {
  }

  ngOnInit() {
    this.equipmentOptionsCollection = this.afs.collection<EquipmentOption>('options', ref => ref.orderBy('name'));
    this.equipmentOptionsCollection.snapshotChanges()
      .subscribe(actions => {
        this.options = actions.map(a => {
          const data = a.payload.doc.data() as EquipmentOption;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });
  }

  addOption(name: string) {
    this.equipmentOptionsCollection.add({name: name})
      .then(value => {
        this.addText = '';
        this.toast.success(`Added ${name}`, 'Success');
      }, reason => {
        this.toast.error(`Error adding ${name}, ${reason.toString()}`, 'Error');
      });
  }

  deleteOption(option: EquipmentOptionId) {
    this.equipmentOptionsCollection.doc(option.id)
      .delete()
      .then(value => {
        this.toast.success(`Deleted ${option.name}`, 'Success');
      }, reason => {
        this.toast.error(`Error deleting ${option.name}, ${reason.toString()}`, 'Error');
      });
  }
}
