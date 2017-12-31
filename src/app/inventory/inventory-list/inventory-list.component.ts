import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Equipment, EquipmentId, EquipmentStatus} from '../../core/equipment.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryDeleteComponent} from '../inventory-delete/inventory-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent {

  private inventoryCollection: AngularFirestoreCollection<Equipment>;
  inventory: Observable<EquipmentId[]>;
  searchForm: FormGroup;

  constructor(private afs: AngularFirestore,
              private modalService: NgbModal,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              public authService: AuthService) {

    this.createForm();
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.searchForm.setValue({searchText: params.search || ''});
        this.inventoryCollection = this.afs.collection<Equipment>('inventory');
        this.inventory = this.inventoryCollection.snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Equipment;
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        }).map(equip => equip.filter(a => {
          if (this.searchForm.value.searchText !== '') {
            return Object.keys(a).some(k => {
              return a[k].toLowerCase().includes(this.searchForm.value.searchText.toLowerCase());
            });
          } else {
            return true;
          }
        }));
      });

  }

  createForm() {
    this.searchForm = this.fb.group({ // <-- the parent FormGroup
      searchText: ['', Validators.required],
    });
  }

  search() {

    console.log('search', {search: this.searchForm.value.searchText !== '' ? this.searchForm.value.searchText : null});
    const urlTree = this.router.createUrlTree([], {
      queryParams: {search: this.searchForm.value.searchText !== '' ? this.searchForm.value.searchText : null},
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }

  searchClear() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: {search: null},
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }

  add() {
    this.inventoryCollection.add({name: 'New Equipment', status: EquipmentStatus.Hidden} as Equipment)
      .then(value => {
        this.router.navigate(['inventory', value.id, 'edit']);
      });
  }

  delete(item: EquipmentId) {

    const modalRef = this.modalService.open(InventoryDeleteComponent);
    modalRef.componentInstance.name = item.name;

    modalRef.result.then((result) => {
      if (result === 'delete') {
        this.inventoryCollection.doc(item.id)
          .delete()
          .catch(reason => {
            console.error(reason);
          });
      }
    });

  }
}
