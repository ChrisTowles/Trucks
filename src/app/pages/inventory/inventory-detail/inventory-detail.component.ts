import {Component, OnInit} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService, InventoryService} from '@app/core';
import {Equipment, EquipmentId, EquipmentImage, EquipmentOption} from '@app/shared';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions} from 'ngx-gallery';
import {ToastrService} from 'ngx-toastr';
import {InventoryDeleteComponent} from '../inventory-delete/inventory-delete.component';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Equipment>;
  private imageCollection: AngularFirestoreCollection<EquipmentImage>;
  item: EquipmentId;
  options: string[] = [];
  galleryOptions: NgxGalleryOptions[] = [
    {
      width: '100%',
      height: '600px',
      imageSize: NgxGalleryImageSize.Cover,
      previewSwipe: true,
      previewZoom: true,
      previewZoomMax: 3,
      previewCloseOnEsc: true,
      previewKeyboardNavigation: true,

      arrowPrevIcon: 'fa fa-arrow-circle-left',
      arrowNextIcon: 'fa fa-arrow-circle-right',

      thumbnails: true,
      thumbnailSize: NgxGalleryImageSize.Contain,
      thumbnailsRows: 2,
      thumbnailsSwipe: true,
    }
  ];
  galleryImages: NgxGalleryImage[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private afs: AngularFirestore,
              private router: Router,
              private modalService: NgbModal,
              private cloudinary: Cloudinary,
              private authService: AuthService,
              private inventoryService: InventoryService,
              private toastr: ToastrService,
              private meta: Meta,
              private title: Title) {
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
          this.itemDoc = this.afs.doc<Equipment>(`inventory/${id}`);
          this.updateMetaData();

          // Get Items
          this.afs.collection<EquipmentOption>(`inventory/${id}/options`)
            .valueChanges()
            .subscribe(options => {
              this.options = options.map(o => o.name);
            });

          // Get Images
          this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${id}/images`, ref =>
            ref.orderBy('order', 'asc')
          );
          this.imageCollection.valueChanges()
            .subscribe(images => {
              images
                .forEach(img => {
                  this.galleryImages.push({
                    small: this.cloudinary.url(img.public_id, {width: 256, crop: 'scale', fetch_format: 'auto'}),
                    medium: this.cloudinary.url(img.public_id, {width: 512, crop: 'scale', fetch_format: 'auto'}),
                    big: this.cloudinary.url(img.public_id, {width: 1024, crop: 'scale', fetch_format: 'auto'}),
                    description: img.url,
                    url: img.url
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
      {name: 'og:type', content: 'website'}
    ]);
    this.title.setTitle(`Craigmyle Trucks - ${this.item.name}`);
  }

  delete(item: EquipmentId) {
    const modalRef = this.modalService.open(InventoryDeleteComponent);
    modalRef.componentInstance.name = name;

    modalRef.result.then((result) => {
      if (result === 'delete') {
        this.itemDoc.delete()
          .then(value => {
            this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
            this.toastr.success(`Deleted ${this.item.name}`, 'Success');
          })
          .catch(reason => {
            console.error(reason);
          });
      }
    });
  }
}
