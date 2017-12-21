import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Equipment, EquipmentId} from '../../core/equipment.model';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {InventoryDeleteComponent} from '../inventory-delete/inventory-delete.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../core/auth.service';
import {NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import {EquipmentImage} from '../../core/equipment-image.model';

@Component({
  selector: 'app-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss']
})
export class InventoryDetailComponent implements OnInit {

  private itemDoc: AngularFirestoreDocument<Equipment>;
  private imageCollection: AngularFirestoreCollection<EquipmentImage>;
  item$: Observable<EquipmentId>;
  item: EquipmentId;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private activatedRoute: ActivatedRoute,
              private afs: AngularFirestore,
              private router: Router,
              private modalService: NgbModal,
              private authService: AuthService) {


  }

  ngOnInit() {

    // Setup Gallery Options
    this.galleryOptions = [
      {
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      }
    ];

    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      const id = params['id'];
      this.itemDoc = this.afs.doc<Equipment>(`inventory/${id}`);
      this.item$ = this.itemDoc.valueChanges()
        .map(data => {
          this.item = {id, ...data};
          return {id, ...data};
        });

      // Setup images
      this.galleryImages = [];
      this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${id}/images`);
      this.imageCollection.valueChanges().subscribe(images => {
        images.forEach(img => {
          console.log('img', img);
          this.galleryImages.push({
            small: img.url,
            medium: img.url,
            big: img.url
          });
        });
      });
    });
  }

  delete(item: EquipmentId) {

    const modalRef = this.modalService.open(InventoryDeleteComponent);
    modalRef.componentInstance.name = this.item.name;

    modalRef.result.then((result) => {
      if (result === 'delete') {
        this.itemDoc.delete()
          .then(value => {
            console.log('delete success');
            this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
          })
          .catch(reason => {

            console.error(reason);
          });
      }
    });

  }
}
