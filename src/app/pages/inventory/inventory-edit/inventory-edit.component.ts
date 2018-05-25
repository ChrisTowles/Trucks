import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {InventoryService} from '@app/core';
import {Equipment, EquipmentId, EquipmentImage, EquipmentImageId, EquipmentOption} from '@app/shared';
import {Cloudinary} from '@cloudinary/angular-5.x';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {FileUploader, FileUploaderOptions, ParsedResponseHeaders} from 'ng2-file-upload';
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, take, tap} from 'rxjs/operators';


@Component({
  selector: 'app-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.scss']
})

export class InventoryEditComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<Equipment>;
  item: EquipmentId;
  name: string;
  private itemOptionsCollection: AngularFirestoreCollection<EquipmentOption>;

  private imageCollection: AngularFirestoreCollection<EquipmentImage>;
  images$: Observable<EquipmentImageId[]>;
  images: EquipmentImageId[];
  imageOrderMax = 0;
  itemForm: FormGroup;
  responses: Array<any>;

  formOptions = {
    years: [],
    options: [],
    categories: [
      'Ambulance',
      'Armored Truck',
      'Attenuator',
      'Auger',
      'Beverage Truck',
      'Box Truck - Straight Truck',
      'Bucket Truck - Boom Truck',
      'Bus',
      'Cab Chassis',
      'Cable Dispenser',
      'Cable Scrappers',
      'Cabover Truck - COE',
      'Cabover Truck - Sleeper',
      'Car Carrier',
      'Cargo Van',
      'Catering Truck - Food Truck',
      'Chipper Truck',
      'Contractor Truck',
      'Conventional - Day Cab',
      'Conventional - Sleeper Truck',
      'Crane Truck',
      'Crew Van',
      'Cutaway-Cube Van',
      'Digger Derrick',
      'Dry Van',
      'Dually',
      'Dump Truck',
      'Expeditor-Hotshot',
      'Farm Truck - Grain Truck',
      'Fire Truck',
      'Flatbed Dump',
      'Flatbed Truck',
      'Fuel Truck - Lube Truck',
      'Garbage Truck',
      'Glass Truck',
      'Grapple Truck',
      'Handicap Van',
      'Hauler',
      'Hooklift Truck',
      'Hot Oil Truck',
      'Insulator Washer',
      'Landscape Truck',
      'Livestock Truck',
      'Logging',
      'Mechanics Truck',
      'Military',
      'Mini Truck',
      'Minibus',
      'Mixer Truck',
      'Moving Van',
      'Oil Tank Truck',
      'Other Truck',
      'Passenger Van',
      'Pickup Truck',
      'Plow Truck - Spreader Truck',
      'Plumber Service Truck',
      'Recycle Truck',
      'Refrigerated Truck',
      'Refuse',
      'Roll Off Truck',
      'Rollback Tow Truck',
      'Roustabout',
      'Salvage Truck',
      'Saw Body',
      'Selfloader',
      'Sewer Trucks',
      'Shredder Truck',
      'Sling Truck',
      'Spray Truck',
      'Stake Bed',
      'Stepvan',
      'Street Cleaner',
      'Sweeper',
      'Tanker Truck',
      'Toter',
      'Tractor',
      'Truck Mounted Stripers',
      'Utility Truck - Service Truck',
      'Vacuum Truck',
      'Van',
      'Waste Oil Trucks',
      'Water Tank',
      'Water Truck',
      'Western Hauler',
      'Winch Truck',
      'Wrecker Tow Truck',
      'Yard Spotter Truck',
      // Custom
      'Truck Box',
      'Truck Bed',
      'Trailer',
      'Car',
      'Other Equipment'
    ].sort(),
    transmissionManufacturers: [
      'Aisin',
      'Allison',
      'DETROIT',
      'Eaton',
      'Ford',
      'Fuller',
      'GM',
      'Mack',
      'Meritor',
      'Mitsubishi',
      'Rockwell',
      'Spicer',
      'TorqShift',
      'Ultra-Shift 10',
      'Ultra-Shift 13',
      'Ultra-Shift 18',
      'Volvo'
    ],
    transmission: [
      '8LL',
      'Auto-10Spd',
      'Auto-12 speed',
      'Auto-2Spd',
      'Auto-3Spd',
      'Auto-4Spd',
      'Auto-5Spd',
      'Auto-6Spd',
      'Auto-7spd',
      'Auto-8spd',
      'Auto-9spd',
      'Automatic',
      'Man-10Spd',
      'Man-12Spd',
      'Man-13Spd',
      'Man-15Spd',
      'Man-18Spd',
      'Man-3Spd',
      'Man-4Spd',
      'Man-5Spd',
      'Man-6Spd',
      'Man-7Spd',
      'Man-8Spd',
      'Man-9Spd'
    ]
  };

  public uploader: FileUploader;

  constructor(private afs: AngularFirestore,
              private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private inventoryService: InventoryService,
              private cloudinary: Cloudinary,
              private http: HttpClient,
              private toastr: ToastrService) {

    this.responses = [];
    this.createForm();
  }

  createForm() {
    this.formOptions.years = this.range(1960, (new Date()).getFullYear(), 1).reverse();
    this.itemForm = this.fb.group({ // <-- the parent FormGroup
      name: ['', [Validators.required, Validators.pattern('[A-Za-z0-9 -]+')]],
      vin: '',
      category: '',
      make: '',
      model: '',
      series: '',
      year: '',
      stockNumber: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      engineManufacturer: '',
      engineModel: '',
      engineHP: '',
      engineCylinders: '',
      engineLiters: ['', [Validators.pattern('[0-9\.]*')]],
      fuelType: '',
      brakeType: '',
      transmission: '',
      transmissionManufacturer: '',
      driveType: '',
      numberRearAxles: '',
      suspension: '',
      rearEndRatio: '',
      gvwr: '',
      gvwrClass: '',
      bedDimensions: '',
      wheelBase: '',
      frontTireSize: '',
      rearTireSize: '',
      odometer: ['', [Validators.pattern('[0-9]*')]],
      price: ['', [Validators.pattern('[0-9]*')]],
      comments: '',
      status: '',
      video_url: ''
    });
  }

  getControl(name: string) {
    return this.itemForm.get(name);
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.parent.params.subscribe((params: Params) => {
      const name = params['name'];

      this.afs.collection<Equipment>('inventory', ref =>
        ref.where('stockNumber', '==', this.inventoryService.getStockNumberFromUri(name))
      )
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
          this.itemForm.patchValue(this.item);
          this.itemDoc = this.afs.doc<Equipment>(`inventory/${this.item.id}`);

          // get options
          this.itemOptionsCollection = this.afs.collection<EquipmentOption>(`inventory/${this.item.id}/options`);

          this.itemOptionsCollection.snapshotChanges()
            .pipe(
              take(1)
            )
            .subscribe(options => {

              this.inventoryService.equipmentOptions.forEach(o => {
                this.formOptions.options.push({
                  id: undefined,
                  name: o.name,
                  value: false
                });
              });

              options.map(a => {
                const d = a.payload.doc.data() as EquipmentOption;
                const new_id = a.payload.doc.id;
                const index = this.formOptions.options.findIndex(value => value.name === d.name);
                if (index >= 0) {
                  this.formOptions.options[index].value = true;
                  this.formOptions.options[index].id = new_id;
                } else {
                  this.formOptions.options.push({
                    id: new_id,
                    name: d.name,
                    value: true
                  });
                }
              });
            });

          // get images
          this.imageCollection = this.afs.collection<EquipmentImage>(`inventory/${this.item.id}/images`, ref =>
            ref.orderBy('order', 'asc')
          );
          this.images$ = this.imageCollection.snapshotChanges()
            .pipe(
              map(actions => {
                return actions
                  .map(a => {
                    const data = a.payload.doc.data() as EquipmentImage;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                  });
              }),
              tap(images => {
                this.images = images;

                // Save the current max order, if not set start at -1 so first will be 0
                if (images.length === 0) {
                  this.imageOrderMax = -1;
                } else {
                  this.imageOrderMax = images[images.length - 1].order;

                  // Check if primary image needs to be updated
                  if (this.item.img_public_id !== images[0].public_id) {
                    this.itemDoc.update({img_public_id: images[0].public_id});
                  }
                }
              })
            );

          this.setupUploader();

        });
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
      const tags = `${this.item.id}`;

      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', `${this.item.id}`);
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

      // If first Image set the main image
      if (this.imageOrderMax === -1) {
        this.itemDoc.update({img_public_id: data.public_id});
      }

      // Add to image collection
      const imgDoc = this.afs.doc<EquipmentImage>(`inventory/${this.item.id}/images/${data.original_filename}`);
      imgDoc.set({
        url: data.secure_url,
        public_id: data.public_id,
        height: data.height,
        width: data.width,
        bytes: data.width,
        order: ++this.imageOrderMax // due to delay in local update, increase this locally and it will be updated again later by server
      });

    };
  }

  save() {
    this.itemDoc.update(this.itemForm.value)
      .then(value => {
        this.toastr.success(`Saved ${this.item.name}`, 'Success');
        // this.router.navigate(['../../'], {relativeTo: this.activatedRoute});
      })
      .catch(reason => {
        this.toastr.error(`${reason.toString()}`, 'Failed');
        console.error(reason);
      });
  }

  deleteImage(img: EquipmentImageId, index: number) {
    // We can't delete from cloudinary, file is left there, we will delete it from db
    this.imageCollection.doc(img.id).delete().then(() => {
      // Replace primary image if first was deleted
      if (index === 0 && this.images.length > 0) {
        this.itemDoc.update({img_public_id: this.images[0].public_id});
      } else {
        this.itemDoc.update({img_public_id: null});
      }
    });
  }

  moveImageUp(img: EquipmentImageId, target: EquipmentImageId, img_public_id: string) {
    this.imageCollection.doc(target.id).update({order: img.order});
    this.imageCollection.doc(img.id).update({order: target.order});
  }

  moveImageDown(img: EquipmentImageId, target: EquipmentImageId, img_public_id: string) {
    this.imageCollection.doc(target.id).update({order: img.order});
    this.imageCollection.doc(img.id).update({order: target.order});
  }

  range(begin, end, interval = 1) {
    const values = [];
    for (let i = begin; i < end; i += interval) {
      values.push(i);
    }
    return values;
  }

  processVin() {
    const vin = this.itemForm.value.vin;
    this.http.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`)
      .subscribe(data => {
        // Read the result field from the JSON response.
        if (data['Results'].length > 0) {
          const vinData = data['Results'][0];
          const newData: Partial<Equipment> = {
            year: parseInt(vinData.ModelYear, 10),
            make: vinData.Make,
            model: vinData.Model,
            series: vinData.Series,
            engineManufacturer: vinData.EngineManufacturer,
            engineModel: vinData.EngineModel,
            engineCylinders: vinData.EngineCylinders,
            engineHP: vinData.EngineHP,
            engineLiters: Math.round(vinData.DisplacementL * 10) / 10,
            fuelType: vinData.FuelTypePrimary,
            gvwrClass: vinData.GVWR.replace(/\(.+\)/, '').trim(),
            driveType: vinData.DriveType,
            brakeType: vinData.BrakeSystemType
          };
          // Remove empty values
          Object.keys(newData)
            .forEach((key) => (newData[key] == null || newData[key] === '') && delete newData[key]);
          this.itemForm.patchValue(newData);
        }


      });
  }

  buildName() {
    this.itemForm.patchValue({
      name: [
        this.itemForm.value.year,
        this.itemForm.value.make,
        this.itemForm.value.model
      ]
        .join(' ')
        .trim()
    });
  }

  saveOption(o: any) {
    if (o.value) {
      this.itemOptionsCollection.add({name: o.name}).then(value => {
        o.id = value.id;
      });
    } else {
      this.afs.doc<EquipmentOption>(`inventory/${this.item.id}/options/${o.id}`).delete();
    }
  }


  searchTransmissionManufacturer = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.formOptions.transmissionManufacturers :
        this.formOptions.transmissionManufacturers.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchTransmission = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.formOptions.transmissionManufacturers :
        this.formOptions.transmission.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchCategory = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? this.formOptions.categories :
        this.formOptions.categories.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );
}
