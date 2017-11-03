import { NgModule } from '@angular/core';
import { TextMaskModule } from 'angular2-text-mask';

import { SigmaBeaconLayoutRoutingModule } from '../../config/routes/sigma.beacon.layout.routing';
import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaBeaconService } from '../../model/services/sigma.beacon.service';
import { SigmaMapService } from '../../model/services/sigma.map.service';
import { SigmaBeaconProfileService } from '../../model/services/sigma.profile.service';
import { SigmaZoneService } from '../../model/services/sigma.zone.service';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconHomeComponent } from '../../view-controller/home/sigma.beacon.home.component';
import { SigmaBeaconHeaderComponent } from '../../view-controller/layout/header/sigma.beacon.header.component';
import { SigmaBeaconSidebarComponent } from '../../view-controller/layout/sidebar/sigma.beacon.sidebar.component';
import { SigmaBeaconLayoutComponent } from '../../view-controller/layout/sigma.beacon.layout.component';
import { SigmaBeaconMapComponent } from '../../view-controller/map/sigma.beacon.map.component';
import { SigmaBeaconProfileComponent } from '../../view-controller/profile/sigma.beacon.profile.component';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';

@NgModule({
   declarations: [
      SigmaBeaconLayoutComponent,
      SigmaBeaconSidebarComponent,
      SigmaBeaconHeaderComponent,
      SigmaBeaconHomeComponent,
      SigmaBeaconMapComponent,
      SigmaBeaconProfileComponent
   ],
   imports: [
      SigmaBeaconLayoutRoutingModule,
      SigmaBeaconSharedModule,
      TextMaskModule
   ],
   providers: [
      {
         provide: SigmaBeaconSessionManagement,
         useValue: window['sessionManager']
      }, {
         provide: AppConfig,
         useValue: window['appConfig']
      }, {
         provide: SigmaBeaconUtility,
         useValue: window['beaconUtility']
      },
      SigmaBeaconProfileService,
      SigmaMapService,
      SigmaBeaconService,
      SigmaZoneService
   ]
})
export class SigmaBeaconLayoutModule {
   constructor(private sessionManager: SigmaBeaconSessionManagement, private appConfig: AppConfig) {
      window['sessionManager'] = this.sessionManager;
      window['appConfig'] = this.appConfig;
   }
}
