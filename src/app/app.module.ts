import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {environment} from '../environments/environment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from './core/auth.service';

import {HomeComponent} from './pages/home/home.component';
import {AboutComponent} from './pages/about/about.component';
import {ContactComponent} from './pages/contact/contact.component';
import {DirectionsComponent} from './pages/directions/directions.component';

import {InventoryComponent} from './pages/inventory/inventory.component';
import {InventoryListComponent} from './pages/inventory/inventory-list/inventory-list.component';
import {InventoryDetailComponent} from './pages/inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './pages/inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './pages/inventory/inventory-equipment.component';
import {InventoryDeleteComponent} from './pages/inventory/inventory-delete/inventory-delete.component';
import {NgxGalleryModule} from 'ngx-gallery';
import {CloudinaryConfiguration, CloudinaryModule} from '@cloudinary/angular-5.x';
import {Cloudinary} from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {AdminComponent} from './pages/admin/admin.component';
import {LocalStorageModule} from 'angular-2-local-storage';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {ToastrModule} from 'ngx-toastr';
import { EquipmentOptionsComponent } from './pages/admin/equipment-options/equipment-options.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { MessagesComponent } from './pages/admin/messages/messages.component';

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
    NgxGalleryModule,
    CloudinaryModule.forRoot({Cloudinary}, environment.cloudinary as CloudinaryConfiguration),
    ToastrModule.forRoot(),
    FileUploadModule,
    LocalStorageModule.withConfig({
      prefix: 'craigmyle-trucks',
      storageType: 'localStorage'
    })
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ContactComponent,
    InventoryComponent,
    InventoryListComponent,
    InventoryDetailComponent,
    InventoryEditComponent,
    InventoryEquipmentComponent,
    InventoryDeleteComponent,
    DirectionsComponent,
    AdminComponent,
    EquipmentOptionsComponent,
    UsersComponent,
    MessagesComponent
  ],
  providers: [
    AuthService,
  ],
  entryComponents: [InventoryDeleteComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}
