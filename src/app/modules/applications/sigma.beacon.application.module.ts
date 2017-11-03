import { NgModule } from '@angular/core';

import { SigmaBeaconApplicationRoutingModule } from '../../config/routes/sigma.beacon.application.routing';
import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaActivityService } from '../../model/services/sigma.activity.service';
import { SigmaApplicationService } from '../../model/services/sigma.application.service';
import { SigmaBeaconService } from '../../model/services/sigma.beacon.service';
import { SigmaZoneService } from '../../model/services/sigma.zone.service';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import {
   SigmaBeaconCouponCrudComponent,
} from '../../view-controller/application/activities/coupons/sigma.beacon.activity.coupon.crud.component';
import {
   SigmaBeaconCustomActionCrudComponent,
} from '../../view-controller/application/activities/custom-actions/sigma.beacon.activity.custom.action.crud.component';
import {
   SigmaBeaconActivityListComponent,
} from '../../view-controller/application/activities/list/sigma.beacon.activity.list.component';
import {
   SigmaBeaconApplicationActivitiesComponent,
} from '../../view-controller/application/activities/sigma.beacon.application.activities.component';
import {
   SigmaBeaconUrlActionCrudComponent,
} from '../../view-controller/application/activities/url-actions/sigma.beacon.actity.url.action.crud.component';
import {
   SigmaBeaconApplicationListComponent,
} from '../../view-controller/application/list/sigma.beacon.application.list.component';
import {
   SigmaBeaconApplicationSettingsComponent,
} from '../../view-controller/application/settings/sigma.beacon.application.settings.component';
import { SigmaBeaconApplicationComponent } from '../../view-controller/application/sigma.beacon.application.component';
import { SigmaBeaconComponentModule } from '../components/sigma.beacon.components.module';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';


@NgModule({
   declarations: [
      SigmaBeaconApplicationComponent,
      SigmaBeaconApplicationListComponent,
      SigmaBeaconApplicationActivitiesComponent,
      SigmaBeaconActivityListComponent,
      SigmaBeaconUrlActionCrudComponent,
      SigmaBeaconCustomActionCrudComponent,
      SigmaBeaconCouponCrudComponent,
      SigmaBeaconApplicationSettingsComponent
   ],
   imports: [
      SigmaBeaconSharedModule,
      SigmaBeaconApplicationRoutingModule,
      SigmaBeaconComponentModule
   ],
   providers: [
      {
         provide: SigmaBeaconSessionManagement,
         useValue: window['sessionManager']
      }, {
         provide: AppConfig,
         useValue: window['appConfig']
      },
      {
         provide: SigmaBeaconUtility,
         useValue: window['beaconUtility']
      },
      SigmaApplicationService,
      SigmaBeaconService,
      SigmaZoneService,
      SigmaActivityService
   ]
})
export class SigmaBeaconApplicationModule {
   constructor(private sessionManager: SigmaBeaconSessionManagement, private appConfig: AppConfig) {
      window['sessionManager'] = this.sessionManager;
      window['appConfig'] = this.appConfig;
   }
}
