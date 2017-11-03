import { NgModule } from '@angular/core';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SigmaBeaconRoutingModule } from '../../config/routes/sigma.beacon.routing';
import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaActivityService } from '../../model/services/sigma.activity.service';
import { SigmaBeaconService } from '../../model/services/sigma.beacon.service';
import { SigmaZoneService } from '../../model/services/sigma.zone.service';
import { SearchPipe } from '../../utils/pipes/sigma.search.pipe';
import { SortPipe } from '../../utils/pipes/sigma.sort.pipe';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconCrudBasicComponent } from '../../view-controller/beacon/crud/basic/sigma.beacon.crud.basic.component';
import {
   SigmaBeaconCrudSettingsComponent,
} from '../../view-controller/beacon/crud/settings/sigma.beacon.crud.settings.component';
import { SigmaBeaconCrudBeaconComponent } from '../../view-controller/beacon/crud/sigma.beacon.crud.beacon.component';
import { SigmaBeaconListBeaconComponent } from '../../view-controller/beacon/list/sigma.beacon.list.beacon.component';
import { SigmaBeaconBeaconComponent } from '../../view-controller/beacon/sigma.beacon.beacon.component';
import { SigmaBeaconComponentModule } from '../components/sigma.beacon.components.module';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';

@NgModule({
   declarations: [
      SigmaBeaconBeaconComponent,
      SigmaBeaconListBeaconComponent,
      SigmaBeaconCrudBeaconComponent,
      SigmaBeaconCrudBasicComponent,
      SigmaBeaconCrudSettingsComponent,
      SearchPipe
   ],
   imports: [
      SigmaBeaconSharedModule,
      SigmaBeaconRoutingModule,
      SigmaBeaconComponentModule,
      ModalModule.forRoot(),
      BootstrapModalModule,
      TooltipModule.forRoot(),
      TextMaskModule
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
      SortPipe,
      SigmaBeaconService,
      SigmaZoneService,
      SigmaActivityService
   ]
})
export class SigmaBeaconModule {
   constructor(private sessionManager: SigmaBeaconSessionManagement, private appConfig: AppConfig) {
      window['sessionManager'] = this.sessionManager;
      window['appConfig'] = this.appConfig;
   }
}

