import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {EquipmentOption} from '../shared/model/equipment-option.model';
import {Equipment, EquipmentId} from '../shared/model/equipment.model';

@Injectable()
export class InventoryService {
  private equipmentOptionsCollection: AngularFirestoreCollection<EquipmentOption>;
  equipmentOptions = [];

  categories: string[] = ['Trucks', 'Truck Boxes', 'Truck Beds', 'Trailers', 'Cars', 'Other Equipment'];

  constructor(private afs: AngularFirestore,
              private authService: AuthService) {
    // Update Option Values

    this.equipmentOptionsCollection = this.afs.collection<EquipmentOption>('options', ref => ref.orderBy('name'));
    this.equipmentOptionsCollection.snapshotChanges()
      .subscribe(actions => {
        this.equipmentOptions = actions.map(a => {
          const data = a.payload.doc.data() as EquipmentOption;
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      });
  }

  getEngineName(equip: EquipmentId): string {
    return [equip.engineManufacturer, equip.engineModel, equip.engineLiters]
      .join(' ');
  }

  getStockNumberFromUri(name: string) {
    return name.split('--')[0]
      .replace(/-/g, ' ')
      .replace(/_/g, '-');
  }

  getUrl(item: Equipment) {
    const name = item.name
      .replace(/-/g, '_')
      .replace(/ /g, '-');

    const stockNumber = item.stockNumber
      .replace(/-/g, '-')
      .replace(/ /g, '-');
    return [stockNumber, name]
      .join('--');


  }
}
