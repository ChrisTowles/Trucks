import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuard} from './core/admin.guard';
import {Error404Component} from './core/error404/error-404.component';
import {AboutComponent} from './pages/about/about.component';
import {AdminComponent} from './pages/admin/admin.component';
import {EquipmentOptionsComponent} from './pages/admin/equipment-options/equipment-options.component';
import {MessagesComponent} from './pages/admin/messages/messages.component';
import {UsersComponent} from './pages/admin/users/users.component';
import {VinToolComponent} from './pages/admin/vin-tool/vin-tool.component';
import {ContactComponent} from './pages/contact/contact.component';
import {DirectionsComponent} from './pages/directions/directions.component';
import {InventoryDetailComponent} from './pages/inventory/inventory-detail/inventory-detail.component';
import {InventoryEditComponent} from './pages/inventory/inventory-edit/inventory-edit.component';
import {InventoryEquipmentComponent} from './pages/inventory/inventory-equipment.component';
import {InventoryListComponent} from './pages/inventory/inventory-list/inventory-list.component';
import {InventoryComponent} from './pages/inventory/inventory.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    children: [
      {path: '', component: InventoryListComponent},
      {
        path: ':name',
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
      {path: 'vin-tool', component: VinToolComponent},
    ]
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
