import { NgModule } from '@angular/core';

import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconZoneRoutingModule } from '../../config/routes/sigma.beacon.zone.routing';
import { SigmaBeaconZoneComponent } from '../../view-controller/zone/sigma.beacon.zone.component';
import { SigmaBeaconZoneListComponent } from '../../view-controller/zone/list/sigma.beacon.zone.list.component';
import { SigmaBeaconZoneCrudComponent } from '../../view-controller/zone/crud/sigma.beacon.zone.crud.component';
import { SigmaZoneService } from '../../model/services/sigma.zone.service';

@NgModule({
   declarations: [
      SigmaBeaconZoneComponent,
      SigmaBeaconZoneListComponent,
      SigmaBeaconZoneCrudComponent
   ],
   imports: [
      SigmaBeaconSharedModule,
      SigmaBeaconZoneRoutingModule
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
      SigmaZoneService
   ]
})
export class SigmaBeaconZoneModule {
   constructor(private sessionManager: SigmaBeaconSessionManagement, private appConfig: AppConfig) {
      window['sessionManager'] = this.sessionManager;
      window['appConfig'] = this.appConfig;
   }
}
