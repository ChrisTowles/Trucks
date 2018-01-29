import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {EquipmentOption, EquipmentOptionId} from '../../../shared/model/equipment-option.model';
import {InventoryService} from '../../../core/inventory.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-equipment-options',
  templateUrl: './equipment-options.component.html',
  styleUrls: ['./equipment-options.component.scss']
})
export class EquipmentOptionsComponent implements OnInit {
  private equipmentOptionsCollection: AngularFirestoreCollection<EquipmentOption>;
  options: EquipmentOptionId[] = [];
  addText = '';

  constructor(private afs: AngularFirestore,
              private inventoryService: InventoryService,
              private toastr: ToastrService) {
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
        this.toastr.success(`Added ${name}`, 'Success');
      }, reason => {
        this.toastr.error(`Error adding ${name}, ${reason.toString()}`, 'Error');
      });
  }

  deleteOption(option: EquipmentOptionId) {
    this.equipmentOptionsCollection.doc(option.id)
      .delete()
      .then(value => {
        this.toastr.success(`Deleted ${option.name}`, 'Success');
      }, reason => {
        this.toastr.error(`Error deleting ${option.name}, ${reason.toString()}`, 'Error');
      });
  }
}
