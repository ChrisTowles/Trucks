import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {CoreModule} from '@app/core';

import {CloudinaryConfiguration, CloudinaryModule} from '@cloudinary/angular-5.x';

import {environment} from '@env/environment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageModule} from 'angular-2-local-storage';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {Angulartics2Module} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/ga';
import {Cloudinary} from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {ToastrModule} from 'ngx-toastr';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';

import {AboutComponent} from './pages/about/about.component';
import {AdminComponent} from './pages/admin/admin.component';
import {EquipmentOptionsComponent} from './pages/admin/equipment-options/equipment-options.component';
import {MessagesComponent} from './pages/admin/messages/messages.component';
import {UsersComponent} from './pages/admin/users/users.component';
import {VinToolComponent} from './pages/admin/vin-tool/vin-tool.component';
import {ContactComponent} from './pages/contact/contact.component';

import {InventoryAddComponent} from './pages/inventory/inventory-add/inventory-add.component';
import {InventoryDeleteComponent} from './pages/inventory/inventory-delete/inventory-delete.component';
import {InventoryDetailComponent} from './pages/inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './pages/inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './pages/inventory/inventory-equipment.component';
import {InventoryListComponent} from './pages/inventory/inventory-list/inventory-list.component';

import {InventoryComponent} from './pages/inventory/inventory.component';

import {MDBBootstrapModulesPro, MDBSpinningPreloader} from 'ng-uikit-pro-standard';
import {AgmCoreModule} from '@agm/core';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'app-root'}),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    NgbModule.forRoot(),
    CoreModule,
    CloudinaryModule.forRoot({Cloudinary}, environment.cloudinary as CloudinaryConfiguration),
    ToastrModule.forRoot(),
    FileUploadModule,
    LocalStorageModule.withConfig({
      prefix: 'craigmyle-trucks',
      storageType: 'localStorage',
    }),
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    MDBBootstrapModulesPro.forRoot(),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyATY3UAWjCc33LlP0hx2Jm5I-nSxj4_2M0'}),
  ],
  declarations: [
    AppComponent,
    AboutComponent,
    ContactComponent,
    InventoryComponent,
    InventoryListComponent,
    InventoryDetailComponent,
    InventoryEditComponent,
    InventoryEquipmentComponent,
    InventoryDeleteComponent,
    AdminComponent,
    EquipmentOptionsComponent,
    UsersComponent,
    MessagesComponent,
    VinToolComponent,
    InventoryAddComponent,
  ],
  providers: [
    MDBSpinningPreloader,
  ],
  entryComponents: [
    InventoryAddComponent,
    InventoryDeleteComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})

export class AppModule {
}
