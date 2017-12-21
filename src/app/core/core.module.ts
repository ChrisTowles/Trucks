import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {throwIfAlreadyLoaded} from './module-import-guard';
import {LoggerService} from './logger.service';

import {NavComponent} from './nav/nav.component';
import {RouterModule} from '@angular/router';
import {Error404Component} from './error404/error-404.component';
import {ProgressBarService} from './progress-bar.service';
import {AuthService} from './auth.service';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgbCollapseModule
  ],
  exports: [
    NavComponent,
  ],
  declarations: [
    NavComponent,
    Error404Component
  ],
  providers: [
    LoggerService,
    ProgressBarService,
    AuthService
  ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
