import { SigmaBeaconZoneCrudComponent } from '../../view-controller/zone/crud/sigma.beacon.zone.crud.component';
import { CanActivateChild, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { SigmaBeaconAuthGuard } from './guards/sigma.beacon.authentication.guard';
import { SigmaBeaconZoneComponent } from '../../view-controller/zone/sigma.beacon.zone.component';
import { SigmaBeaconZoneListComponent } from '../../view-controller/zone/list/sigma.beacon.zone.list.component';


const ROUTES: Routes = [
   {
      path: '',
      component: SigmaBeaconZoneComponent,
      canActivate: [SigmaBeaconAuthGuard],
      children: [
         {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
         },
         {
            path: 'list',
            component: SigmaBeaconZoneListComponent,
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: 'new',
            component: SigmaBeaconZoneCrudComponent,
            data: { editable: false },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/edit',
            component: SigmaBeaconZoneCrudComponent,
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
export class SigmaBeaconZoneRoutingModule {
   static routes = ROUTES;
}
