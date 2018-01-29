import {Component} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Equipment, EquipmentId, EquipmentStatus} from '../../../shared/model/equipment.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, Router} from '@angular/router';
import {InventoryDeleteComponent} from '../inventory-delete/inventory-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../core/auth.service';
import {Meta, Title} from '@angular/platform-browser';
import {InventoryService} from '../../../core/inventory.service';
import {ToastrService} from 'ngx-toastr';
import {LocalStorageService} from 'angular-2-local-storage';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent {

  private inventoryCollection: AngularFirestoreCollection<Equipment>;
  inventory: Observable<EquipmentId[]>;
  searchForm: FormGroup;
  category: string;
  admin = false;

  constructor(private afs: AngularFirestore,
              private modalService: NgbModal,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              public inventoryService: InventoryService,
              public authService: AuthService,
              private toastr: ToastrService,
              private localStorageService: LocalStorageService,
              private meta: Meta,
              private title: Title) {

    this.category = this.localStorageService.get<string>('list-category') || 'All';
    this.createForm();
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.searchForm.setValue({searchText: params.search || ''});


        this.authService.user.take(1).subscribe(user => {
          if (user && user.admin) {
            this.admin = true;
          }
          this.getInventory();
        });


      });

    this.meta.addTags([
      {name: 'description', content: 'Inventory Page for Craigmyle Trucks'}
    ]);
    this.title.setTitle('Craigmyle Trucks - Inventory');
  }

  getInventory() {
    if (this.admin) {
      if (this.category !== 'All') {
        this.inventoryCollection = this.afs
          .collection<Equipment>('inventory', ref => {
            return ref.where('category', '==', this.category);
          });
      } else {
        this.inventoryCollection = this.afs
          .collection<Equipment>('inventory');
      }

    } else {
      if (this.category !== 'All') {
        this.inventoryCollection = this.afs
          .collection<Equipment>('inventory', ref => {
            return ref
              .where('status', '==', 1)
              .where('category', '==', this.category);
          });
      } else {
        this.inventoryCollection = this.afs
          .collection<Equipment>('inventory', ref => ref.where('status', '==', 1));
      }
    }


    this.inventory = this.inventoryCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Equipment;
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }).map(equip => equip.filter(a => {
      if (this.searchForm.value.searchText !== '') {
        return Object.keys(a).some(k => {
          if (typeof a[k] === 'string') {
            return a[k].toLowerCase().includes(this.searchForm.value.searchText.toLowerCase());
          } else {
            return false;
          }
        });
      } else {
        return true;
      }
    }));
  }

  createForm() {
    this.searchForm = this.fb.group({ // <-- the parent FormGroup
      searchText: ['', Validators.required],
    });
  }

  search() {

    const urlTree = this.router.createUrlTree([], {
      queryParams: {search: this.searchForm.value.searchText !== '' ? this.searchForm.value.searchText : null},
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }

  setCategory(category: string) {
    this.category = category;
    this.localStorageService.set('list-category', this.category);
    this.getInventory();
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
    this.inventoryCollection.add({model: 'Unknown', status: EquipmentStatus.Hidden, category: 'Truck'} as Equipment)
      .then(value => {
        this.router.navigate(['inventory', value.id, 'edit']);
      });
  }

  delete(item: EquipmentId) {

    const name = item.name;
    const modalRef = this.modalService.open(InventoryDeleteComponent);
    modalRef.componentInstance.name = name;

    modalRef.result.then((result) => {
      if (result === 'delete') {
        this.inventoryCollection.doc(item.id)
          .delete()
          .then(() => {
            this.toastr.success(`Deleted ${name}`, 'Success');
          })
          .catch(reason => {
            this.toastr.error(`${reason.toString()}`, 'Failed');
            console.error(reason);
          });
      }
    });

  }
}
