import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
   SigmaBeaconCouponCrudComponent,
} from '../../view-controller/application/activities/coupons/sigma.beacon.activity.coupon.crud.component';
import {
   SigmaBeaconCustomActionCrudComponent,
} from '../../view-controller/application/activities/custom-actions/sigma.beacon.activity.custom.action.crud.component';
import {
   SigmaBeaconApplicationActivitiesComponent,
} from '../../view-controller/application/activities/sigma.beacon.application.activities.component';
import {
   SigmaBeaconUrlActionCrudComponent,
} from '../../view-controller/application/activities/url-actions/sigma.beacon.actity.url.action.crud.component';
import {
   SigmaBeaconApplicationListComponent,
} from '../../view-controller/application/list/sigma.beacon.application.list.component';
import { SigmaBeaconApplicationComponent } from '../../view-controller/application/sigma.beacon.application.component';
import { SigmaBeaconAuthGuard } from './guards/sigma.beacon.authentication.guard';

const ROUTES: Routes = [
   {
      path: '',
      component: SigmaBeaconApplicationComponent,
      canActivate: [SigmaBeaconAuthGuard],
      children: [
         {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full'
         }, {
            path: 'list',
            component: SigmaBeaconApplicationListComponent,
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities',
            component: SigmaBeaconApplicationActivitiesComponent,
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/url/new',
            component: SigmaBeaconUrlActionCrudComponent,
            data: { editable: false },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/url/:activityId/edit',
            component: SigmaBeaconUrlActionCrudComponent,
            data: { editable: true },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/custom/new',
            component: SigmaBeaconCustomActionCrudComponent,
            data: { editable: false },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/custom/:activityId/edit',
            component: SigmaBeaconCustomActionCrudComponent,
            data: { editable: true },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/coupon/new',
            component: SigmaBeaconCouponCrudComponent,
            data: { editable: false },
            canActivate: [SigmaBeaconAuthGuard]
         }, {
            path: ':id/:app_name/activities/coupon/:activityId/edit',
            component: SigmaBeaconCouponCrudComponent,
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
export class SigmaBeaconApplicationRoutingModule {
   static routes = ROUTES;
}
