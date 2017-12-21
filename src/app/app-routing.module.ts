import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from './core/error404/error-404.component';
import {HomeComponent} from './home/home.component';
import {InventoryComponent} from './inventory/inventory.component';
import {InventoryListComponent} from './inventory/inventory-list/inventory-list.component';
import {InventoryDetailComponent} from './inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './inventory/inventory-equipment.component';
import {ContactComponent} from './contact/contact.component';
import {AboutComponent} from './about/about.component';
import {DirectionsComponent} from './directions/directions.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: HomeComponent},
  {path: 'directions', component: DirectionsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'about', component: AboutComponent},
  {
    path: 'inventory',
    component: InventoryComponent,
    children: [
      {path: '', component: InventoryListComponent},
      {
        path: ':id',
        component: InventoryEquipmentComponent,
        children: [
          {path: '', component: InventoryDetailComponent},
          {path: 'edit', component: InventoryEditComponent}
        ],
      }
    ],
  },
  {path: '404', component: Error404Component},

  // otherwise redirect to 404
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
