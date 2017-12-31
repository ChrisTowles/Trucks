import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Equipment} from '../../core/equipment.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {EquipmentImage, EquipmentImageId} from '../../core/equipment-image.model';
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {Cloudinary} from '@cloudinary/angular-5.x';

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
  responses: Array<any>;

  public uploader: FileUploader;

  constructor(private afs: AngularFirestore,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private cloudinary: Cloudinary) {

    this.responses = [];
    this.createForm();

    this.cloudinary.url()

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
      comments: '',
      status: ''
    });
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

      this.setupUploader();
    });
  }

  private setupUploader() {

    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      const tags = `${this.id}`;

      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', `${this.id}`);
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;
      return {fileItem, form};
    };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {
      const data = JSON.parse(response);
      console.log(data);

      const imgDoc = this.afs.doc<EquipmentImage>(`inventory/${this.id}/images/${data.original_filename}`);
      imgDoc.set({
        url: data.secure_url,
        public_id: data.public_id,
        height: data.height,
        width: data.width,
        bytes: data.width,
        order: this.images.length
      });
    };
  }

  save() {
    this.itemDoc.update(this.itemForm.value)
      .then(value => {
        this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
      });
  }

  deleteImage(img: EquipmentImageId) {
    // We can't delete from cloudinary, file is left there, we will delete it from db
    this.imageCollection.doc(img.id).delete();
  }

}
