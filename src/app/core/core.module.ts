import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {throwIfAlreadyLoaded} from './module-import-guard';

import {NavComponent} from './nav/nav.component';
import {FooterComponent} from './footer/footer.component';
import {RouterModule} from '@angular/router';
import {Error404Component} from './error404/error-404.component';
import {AuthService} from './auth.service';
import {NgbCollapseModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminGuard} from './admin.guard';
import {InventoryService} from './inventory.service';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    HttpClientModule,
  ],
  exports: [
    NavComponent,
    FooterComponent,
  ],
  declarations: [
    NavComponent,
    FooterComponent,
    Error404Component
  ],
  providers: [
    AuthService,
    AdminGuard,
    InventoryService
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
