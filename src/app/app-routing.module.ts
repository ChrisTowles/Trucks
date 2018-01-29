import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Error404Component} from './core/error404/error-404.component';
import {HomeComponent} from './pages/home/home.component';
import {InventoryComponent} from './pages/inventory/inventory.component';
import {InventoryListComponent} from './pages/inventory/inventory-list/inventory-list.component';
import {InventoryDetailComponent} from './pages/inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './pages/inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './pages/inventory/inventory-equipment.component';
import {ContactComponent} from './pages/contact/contact.component';
import {AboutComponent} from './pages/about/about.component';
import {DirectionsComponent} from './pages/directions/directions.component';
import {AdminComponent} from './pages/admin/admin.component';
import {AdminGuard} from './core/admin.guard';
import {MessagesComponent} from './pages/admin/messages/messages.component';
import {UsersComponent} from './pages/admin/users/users.component';
import {EquipmentOptionsComponent} from './pages/admin/equipment-options/equipment-options.component';

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: HomeComponent},
  {path: 'directions', component: DirectionsComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'about', component: AboutComponent},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {path: 'messages', component: MessagesComponent},
      {path: 'users', component: UsersComponent},
      {path: 'equipment-options', component: EquipmentOptionsComponent},
    ]
  },
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
          {
            path: 'edit', component: InventoryEditComponent, canActivate: [AdminGuard]
          }
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
    RouterModule.forRoot(routes) // For debugging add: {enableTracing: true}
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule {
}
