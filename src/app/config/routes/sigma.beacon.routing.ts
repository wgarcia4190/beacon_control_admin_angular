import { CanActivateChild, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { SigmaBeaconAuthGuard } from './guards/sigma.beacon.authentication.guard';
import { SigmaBeaconBeaconComponent } from '../../view-controller/beacon/sigma.beacon.beacon.component';
import { SigmaBeaconCrudBeaconComponent } from '../../view-controller/beacon/crud/sigma.beacon.crud.beacon.component';
import { SigmaBeaconListBeaconComponent } from '../../view-controller/beacon/list/sigma.beacon.list.beacon.component';


const ROUTES: Routes = [
   {
      path: '',
      component: SigmaBeaconBeaconComponent,
      canActivate: [SigmaBeaconAuthGuard],
      children: [
         {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
         },
         {
            path: 'list',
            component: SigmaBeaconListBeaconComponent,
            canActivate: [SigmaBeaconAuthGuard]
         },
         {
            path: 'new',
            component: SigmaBeaconCrudBeaconComponent,
            data: { editable: false },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/edit',
            component: SigmaBeaconCrudBeaconComponent,
            data: { editable: true },
            canActivate: [SigmaBeaconAuthGuard]
         }
      ]
   }
];

@NgModule({
   imports: [
      RouterModule.forChild(ROUTES)
   ],
   exports: [RouterModule]
})
export class SigmaBeaconRoutingModule {
   static routes = ROUTES;
}
