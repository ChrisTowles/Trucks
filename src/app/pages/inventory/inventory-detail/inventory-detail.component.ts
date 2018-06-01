import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DomSanitizer, Meta, SafeResourceUrl, Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService, InventoryService} from '@app/core';
import {Equipment, EquipmentId, EquipmentImage, EquipmentOption} from '@app/shared';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {ToastService} from 'ng-uikit-pro-standard';


interface BasicImage {
  img: string;
  thumb: string;
}

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss'],
})
export class InventoryDetailComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Equipment>;
  private imageCollection: AngularFirestoreCollection<EquipmentImage>;
  item: EquipmentId;
  options: string[] = [];
  video_url: SafeResourceUrl;


  imagesBasic: BasicImage[] = [];
  allSpecs = [];

  constructor(private activatedRoute: ActivatedRoute,
              private afs: AngularFirestore,
              private router: Router,
              private cloudinary: Cloudinary,
              public authService: AuthService,
              private inventoryService: InventoryService,
              private toast: ToastService,
              public sanitizer: DomSanitizer,
              private meta: Meta,
              private title: Title) {
  }


  setAllSpecs() {
    this.allSpecs = [
      {text: 'Year', value: this.item.year},
      {text: 'Make', value: this.item.make},
      {text: 'Model', value: this.item.model},
      // {text: 'Vin', value: this.item.vin},
      {text: 'Series', value: this.item.series},
      {text: 'GVWR', value: this.item.gvwr},
      {text: 'GVWR Class', value: this.item.gvwrClass},
      {text: 'Engine Manufacturer', value: this.item.engineManufacturer},
      {text: 'Engine Model', value: this.item.engineModel},
      {text: 'Engine Liters', value: this.item.engineLiters},
      {text: 'Engine HP', value: this.item.engineHP},
      {text: 'Engine Cylinders', value: this.item.engineCylinders},
      {text: 'Fuel Type', value: this.item.fuelType},
      {text: 'Transmission Manufacturer', value: this.item.transmissionManufacturer},
      {text: 'Transmission', value: this.item.transmission},
      {text: 'Drive Type', value: this.item.driveType},
      {text: 'Number Rear Axles', value: this.item.numberRearAxles},
      {text: 'Front Tire Size', value: this.item.frontTireSize},
      {text: 'Rear Tire Size', value: this.item.rearTireSize},
      {text: 'Suspension', value: this.item.suspension},
      {text: 'Rear End Ratio', value: this.item.rearEndRatio},
      {text: 'Bed Dimensions', value: this.item.bedDimensions},
      {text: 'Wheel Base', value: this.item.wheelBase},
      {text: 'Odometer', value: this.item.odometer},
      {text: 'Brake Type', value: this.item.brakeType},
    ];
  }

  ngOnInit() {

    // Subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const name = params['name'];

      this.afs.collection<Equipment>('inventory', ref => ref.where('stockNumber', '==', this.inventoryService.getStockNumberFromUri(name)))
        .snapshotChanges()
        .subscribe(equipment => {
          if (equipment.length < 1) {
            // No item found, route back to inventory
            this.router.navigate(['/inventory']);
            return;
          } else {
            if (equipment.length > 1) {
              console.error('More than one equipment by that name was found.');
            }
          }

          // Set item
          const data = equipment[0].payload.doc.data() as Equipment;
          const id = equipment[0].payload.doc.id;
          this.item = {id, ...data};
          this.setAllSpecs();
          this.itemDoc = this.afs.doc<Equipment>(`inventory/${id}`);
          this.updateMetaData();
          this.video_url = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + this.item.video_url + '?rel=0');

          // Get Items
          this.afs.collection<EquipmentOption>(`inventory/${id}/options`)
            .valueChanges()
            .subscribe(options => {
              this.options = options.map(o => o.name);
            });

          // Get Images
          this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${id}/images`, ref =>
            ref.orderBy('order', 'asc'),
          );
          this.imageCollection.valueChanges()
            .subscribe(images => {
              images
                .forEach((img, index, arr) => {
                  this.imagesBasic.push({
                    img: this.cloudinary.url(img.public_id, {width: 1024, crop: 'scale', fetch_format: 'auto'}),
                    thumb: this.cloudinary.url(img.public_id, {width: 256, crop: 'scale', fetch_format: 'auto'}),
                  });

                });
            });
        });
    });
  }

  updateMetaData() {
    this.meta.addTags([
      {name: 'description', content: this.item.name},
      {name: 'og:title', content: `Craigmyle Trucks - ${this.item.name}`},
      {name: 'og:description', content: this.item.name},
      {name: 'og:image', content: this.cloudinary.url(this.item.img_public_id, {width: 512, crop: 'scale', fetch_format: 'auto'})},
      {name: 'og:type', content: 'website'},
    ]);
    this.title.setTitle(`Craigmyle Trucks - ${this.item.name}`);
  }

  delete(item: EquipmentId) {
    // TODO: Fix delete
    console.log('Delete disabled');
    // const modalRef = this.modalService.open(InventoryDeleteComponent);
    // modalRef.componentInstance.name = name;
    //
    // modalRef.result.then((result) => {
    //   if (result === 'delete') {
    //     this.itemDoc.delete()
    //       .then(value => {
    //         this.router.navigate(['/']);
    //         this.toast.success(`Deleted ${this.item.name}`, 'Success');
    //       })
    //       .catch(reason => {
    //         console.error(reason);
    //       });
    //   }
    // });
  }

  // Swiping lightbox on mobile
  @ViewChild('lightbox') public el: any;

  @HostListener('swipeleft', ['$event'])
  public swipePrev(event: any) {
    this.el.nextImage();
  }

  @HostListener('swiperight', ['$event'])
  public swipeNext(event: any) {
    this.el.prevImage();
  }
}
