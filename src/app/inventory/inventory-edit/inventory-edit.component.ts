import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Equipment} from '../../core/equipment.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AngularFireStorage} from 'angularfire2/storage';
import {EquipmentImage, EquipmentImageId} from '../../core/equipment-image.model';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.scss']
})
export class InventoryEditComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<Equipment>;
  item: Observable<Equipment>;
  private imageCollection: AngularFirestoreCollection<EquipmentImage>;
  images: EquipmentImageId[];
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  itemForm: FormGroup;
  id: string;

  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private fb: FormBuilder,
              private router: Router,
              private dragulaService: DragulaService,
              private activatedRoute: ActivatedRoute) {

    this.createForm();

    // Return image to last location and dropped outside of row
    this.dragulaService.setOptions('images', {
      revertOnSpill: true
    });

    this.dragulaService.dropModel.subscribe((value) => {
      console.log(value);
      if (value[0] === 'images') {
        this.onImageDrop(value.slice(1));
      }
    });
  }


  createForm() {
    this.itemForm = this.fb.group({ // <-- the parent FormGroup
      name: ['', Validators.required],
      stockNumber: '',
      engineMake: '',
      engineModel: '',
      engineHP: '',
      transmission: '',
      suspension: '',
      rearEndRatio: '',
      gvwr: '',
      bedDimensions: '',
      wheelBase: '',
      odometer: '',
      price: '',
      comments: ''
    });
  }

  private onImageDrop(args) {
    const [e, el, source] = args;
    console.log('e', e);
    console.log('el', el);
    console.log('source', source);
    // do something
  }


  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.parent.params.subscribe((params: Params) => {
      this.id = params['id'];

      // get item and update form
      this.itemDoc = this.afs.doc<Equipment>(`inventory/${this.id}`);
      this.item = this.itemDoc.valueChanges()
        .do(data => {
          this.itemForm.patchValue(data);
        });

      // get images
      this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${this.id}/images`);
      this.imageCollection.snapshotChanges()
        .subscribe(actions => {
          this.images = actions.map(a => {
            const data = a.payload.doc.data() as EquipmentImage;
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        });
    });
  }

  save() {
    this.itemDoc.update(this.itemForm.value)
      .then(value => {
        this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
      });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `inventory/${this.id}/${file.name}`;
    const task = this.storage.upload(filePath, file);


    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    this.downloadURL = task.downloadURL();


    // this.downloadURL.subscribe(url => {
    //   console.log('wrong', url); // will be null on large files larger then a few kb
    // });

    task.then().then(a => {
      const imgDoc = this.afs.doc<EquipmentImage>(`inventory/${this.id}/images/${file.name}`);
      imgDoc.set({
        url: a.metadata.downloadURLs[0]
      });
    });

  }

  deleteImage(img: EquipmentImageId) {
    this.imageCollection.doc(img.id).delete().then((value => {
      this.storage.ref(`inventory/${this.id}/${img.id}`).delete();
    }));
  }
}
