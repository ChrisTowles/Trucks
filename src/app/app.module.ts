import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {CoreModule} from './core/core.module';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ProgressBarService} from './core/progress-bar.service';
import {ProgressInterceptor} from './shared/interceptors/progress.interceptor';
import {TimingInterceptor} from './shared/interceptors/timing.interceptor';

import {environment} from '../environments/environment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AuthService} from './core/auth.service';

import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {ContactComponent} from './contact/contact.component';
import {DirectionsComponent} from './directions/directions.component';

import {InventoryComponent} from './inventory/inventory.component';
import {InventoryListComponent} from './inventory/inventory-list/inventory-list.component';
import {InventoryDetailComponent} from './inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './inventory/inventory-equipment.component';
import {InventoryDeleteComponent} from './inventory/inventory-delete/inventory-delete.component';
import {NgxGalleryModule} from 'ngx-gallery';
import {CloudinaryConfiguration, CloudinaryModule} from '@cloudinary/angular-5.x';
import {Cloudinary} from 'cloudinary-core';
import {FileUploadModule} from 'ng2-file-upload';
import {AdminComponent} from './admin/admin.component';
import {LocalStorageModule} from 'angular-2-local-storage';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';

@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'app-root'}),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    NgbModule.forRoot(),
    CoreModule,
    NgxGalleryModule,
    CloudinaryModule.forRoot({Cloudinary}, environment.cloudinary as CloudinaryConfiguration),
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
    AdminComponent
  ],
  providers: [
    AuthService,
    {provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressBarService]},
    {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true}
  ],
  entryComponents: [InventoryDeleteComponent],
  bootstrap: [AppComponent]
})

export class AppModule {
}
