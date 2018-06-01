import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, InventoryService} from '@app/core';
import {Equipment, EquipmentId, EquipmentStatus} from '@app/shared';
import {LocalStorageService} from 'angular-2-local-storage';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

import {BehaviorSubject, combineLatest} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {ToastService} from 'ng-uikit-pro-standard';

interface Category {
  name: string;
  count: number;
}

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
})
export class InventoryListComponent {

  private inventoryCollection: AngularFirestoreCollection<Equipment>;
  inventory: EquipmentId[] = [];
  searchForm: FormGroup;

  categories: Category[] = [{name: 'All', count: 0}];
  category: Category = this.categories[0];
  categoryFilter$: BehaviorSubject<string | null>;

  statuses: Status[] = [{name: 'All', value: null}];
  status: Status;
  statusFilter$: BehaviorSubject<EquipmentStatus | null>;

  adminFilter$: BehaviorSubject<boolean | null>;

  searchFilter$: BehaviorSubject<string | null>;

  @ViewChild('stockNumber') vc: ElementRef;
  addForm: FormGroup;


  constructor(private afs: AngularFirestore,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              public inventoryService: InventoryService,
              public authService: AuthService,
              private toast: ToastService,
              private localStorageService: LocalStorageService,
              private meta: Meta,
              private title: Title) {

    // Redirect if /inventory
    if (this.router.url === '/inventory') {
      this.router.navigate(['/']);
    }

    this.adminFilter$ = new BehaviorSubject(null);
    this.categoryFilter$ = new BehaviorSubject(this.localStorageService.get<string>('list-category') || 'All');
    this.statusFilter$ = new BehaviorSubject(this.localStorageService.get<number>('list-status'));
    this.searchFilter$ = new BehaviorSubject(null);

    for (const es in EquipmentStatus) {
      if (isNaN(Number(es))) {
        this.statuses.push({name: es, value: Number(EquipmentStatus[es])});
      }
    }
    this.status = this.statuses.find(a => a.value === this.statusFilter$.getValue());

    this.createForm();

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.searchForm.setValue({searchText: params.search || ''});
        this.searchFilter$.next(params.search || '');
      });

    // Update Categories
    combineLatest(
      this.searchFilter$,
      this.statusFilter$,
      this.authService.user,
    ).subscribe(([search, status, user]) => {
        this.afs.collection<Equipment>('inventory', ref => {
          // Order by stockNumber
          let query = ref.orderBy('stockNumber', 'desc');
          // Filter by status based on admin
          if (!user || !user.admin) {
            query = query.where('status', '==', 1);
          }

          // Filter by status based on admin
          if (!user || !user.admin) {
            query = query.where('status', '==', EquipmentStatus.Visible);
          } else if (status != null) {
            query = query.where('status', '==', status);
          }

          return query;
        }).valueChanges()
          .subscribe((equip) => {
            // Build object with category counts
            const categories = equip.map(a => a.category);

            const result = {};
            for (let i = 0; i < categories.length; ++i) {
              if (!result[categories[i]]) {
                result[categories[i]] = 0;
              }
              ++result[categories[i]];
            }

            // Remove everything but All and update total
            this.categories = this.categories.filter(a => a.name === 'All');
            this.categories[0].count = equip.length;

            // Add other categories with count
            for (const x of Object.keys(result)) {
              this.categories.push({name: x, count: result[x]});
            }

            // Set back to stored value if present
            const name = this.localStorageService.get<string>('list-category') || 'All';
            let index = this.categories.findIndex(a => a.name === name);
            if (index < 0) {
              index = 0;
            }
            if (this.category !== this.categories[index]) {
              this.setCategory(this.categories[index]);
            }

          });
      },
    );


    // Update inventory
    combineLatest(
      this.searchFilter$,
      this.authService.user,
      this.categoryFilter$,
      this.statusFilter$)
      .subscribe(
        ([search, user, category, status]) => {

          // Get Inventory
          this.inventoryCollection = this.afs.collection<Equipment>('inventory', ref => {
            // Order by stockNumber
            let query = ref.orderBy('stockNumber', 'desc');

            // Filter by Category
            if (category && category !== 'All') {
              query = query.where('category', '==', category);
            }
            // Filter by status based on admin
            if (!user || !user.admin) {
              query = query.where('status', '==', EquipmentStatus.Visible);
            } else if (status != null) {
              query = query.where('status', '==', status);
            }

            return query;
          });

          this.inventoryCollection.snapshotChanges()
            .pipe(
              map(actions => actions.map(a => {
                const data = a.payload.doc.data() as Equipment;
                const id = a.payload.doc.id;
                return {id, ...data};
              })),
              map(equip => equip.filter(a => {
                if (search !== '') {
                  return Object.keys(a).some(k => {
                    if (typeof a[k] === 'string') {
                      return a[k].toLowerCase().includes(search.toLowerCase());
                    } else {
                      return false;
                    }
                  });
                } else {
                  return true;
                }
              })),
            ).subscribe(equip => {

            this.inventory = equip;

          });
        },
      );


    this.addForm = this.fb.group({ // <-- the parent FormGroup
      stockNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
    });

    this.meta.addTags([
      {name: 'description', content: 'Inventory Page for Craigmyle Trucks'},
    ]);
    this.title.setTitle('Craigmyle Trucks - Inventory');
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
      preserveFragment: true,
    });
    this.router.navigateByUrl(urlTree);
  }

  setCategory(category: Category) {
    this.category = category;
    this.categoryFilter$.next(category.name);
    this.localStorageService.set('list-category', category.name);
  }

  setStatus(status: Status) {
    this.status = status;
    this.statusFilter$.next(status.value);
    this.localStorageService.set('list-status', status.value);
  }

  searchClear() {
    const urlTree = this.router.createUrlTree([], {
      queryParams: {search: null},
      queryParamsHandling: 'merge',
      preserveFragment: true,
    });
    this.router.navigateByUrl(urlTree);
  }

  add(data) {
    // Check if stockNumber is already in use
    this.afs.collection<Equipment>('inventory', ref => ref.where('stockNumber', '==', data.stockNumber))
      .snapshotChanges().pipe(
      take(1),
    )
      .subscribe(equipment => {
        if (equipment.length === 0) {
          const tmp = {
            name: 'Unknown',
            status: EquipmentStatus.Hidden,
            stockNumber: data.stockNumber,
            category: 'Truck',
          } as Equipment;

          this.inventoryCollection.add(tmp)
            .then(value => {

              this.router.navigate(['inventory', this.inventoryService.getUrl(tmp), 'edit']);
              this.toast.success(`Added Stock # ${data.stockNumber}`, 'Success');
            })
            .catch(reason => {
              this.toast.error(`${reason.toString()}`, 'Failed');
              console.error(reason);
            });

        } else {
          this.toast.error(`Stock Number is already in use!`, 'Failed');
        }


      });
  }

  delete(item: EquipmentId) {

    const name = item.name;
    // const modalRef = this.modalService.open(InventoryDeleteComponent);
    // modalRef.componentInstance.name = name;
    //
    // modalRef.result.then((result) => {
    //   if (result === 'delete') {
    //     this.inventoryCollection.doc(item.id)
    //       .delete()
    //       .then(() => {
    //         this.toast.success(`Deleted ${name}`, 'Success');
    //       })
    //       .catch(reason => {
    //         this.toast.error(`${reason.toString()}`, 'Failed');
    //         console.error(reason);
    //       });
    //   }
    // });

  }

  toggleCommericalTruckTrader(item: EquipmentId) {
    item.commercialTruckTrader = !item.commercialTruckTrader;
    const itemDoc = this.afs.doc<Equipment>(`inventory/${item.id}`);
    itemDoc.update({commercialTruckTrader: item.commercialTruckTrader})
      .then(value => {
        this.toast.success(`Saved ${item.name}`, 'Success');
      })
      .catch(reason => {
        this.toast.error(`${reason.toString()}`, 'Failed');
        console.error(reason);
      });
  }
}

interface Status {
  value: number | null;
  name: string;
}
