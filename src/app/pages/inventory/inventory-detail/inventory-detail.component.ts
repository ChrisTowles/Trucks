import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Equipment, EquipmentId} from '../../../shared/model/equipment.model';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {InventoryDeleteComponent} from '../inventory-delete/inventory-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../../core/auth.service';
import {NgxGalleryImage, NgxGalleryImageSize, NgxGalleryOptions} from 'ngx-gallery';
import {EquipmentImage} from '../../../shared/model/equipment-image.model';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {Meta, Title} from '@angular/platform-browser';
import {InventoryService} from '../../../core/inventory.service';
import {ToastrService} from 'ngx-toastr';
import {EquipmentOption} from '../../../shared/model/equipment-option.model';

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
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

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

    // Setup Gallery Options
    this.galleryOptions = [
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

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      this.itemDoc = this.afs.doc<Equipment>(`inventory/${id}`);
      this.itemDoc.valueChanges()
        .subscribe(data => {
          if (data) {
            this.item = {id, ...data};

            this.meta.addTags([
              {name: 'description', content: this.item.name},
              {name: 'og:title', content: `Craigmyle Trucks - ${this.item.name}`},
              {name: 'og:description', content: this.item.name},
              {name: 'og:image', content: this.cloudinary.url(this.item.img_public_id, {width: 512, crop: 'scale', fetch_format: 'auto'})},
              {name: 'og:type', content: 'website'}
            ]);
            this.title.setTitle(`Craigmyle Trucks - ${this.item.name}`);
          } else {
            // No item found, route back to inventory
            this.router.navigate(['/inventory']);
          }
        });

      this.afs.collection<EquipmentOption>(`inventory/${id}/options`)
        .valueChanges()
        .subscribe(options => {
          this.options = options.map(o => o.name);
        });

      // Setup images
      this.galleryImages = [];
      this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${id}/images`);
      this.imageCollection.valueChanges()
        .subscribe(images => {
          images
            .sort((a) => a.order)
            .forEach(img => {
              this.galleryImages.push({
                small: this.cloudinary.url(img.public_id, {width: 256, crop: 'scale', fetch_format: 'auto'}),
                medium: this.cloudinary.url(img.public_id, {width: 512, crop: 'scale', fetch_format: 'auto'}),
                big: this.cloudinary.url(img.public_id, {width: 1024, crop: 'scale', fetch_format: 'auto'}),
                description: img.url,
                url: img.url
              })
              ;
            });
        });
    });
  }

  delete(item: EquipmentId) {

    const name = this.item.name;
    const modalRef = this.modalService.open(InventoryDeleteComponent);
    modalRef.componentInstance.name = name;

    modalRef.result.then((result) => {
      if (result === 'delete') {
        this.itemDoc.delete()
          .then(value => {
            this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
            this.toastr.success(`Deleted ${name}`, 'Success');
          })
          .catch(reason => {
            console.error(reason);
          });
      }
    });

  }
}
