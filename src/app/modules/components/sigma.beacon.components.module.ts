import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SigmaBeaconSquareRadioComponent } from '../../view-controller/components/sigma.beacon.square.radio.component';
import {
   SigmaBeaconSquareRadioContentComponent,
} from '../../view-controller/components/sigma.beacon.square.radio.content.component';
import { SigmaBeaconTabContentComponent } from '../../view-controller/components/sigma.beacon.tabcontent.component';
import { SigmaBeaconTabsComponent } from '../../view-controller/components/sigma.beacon.tabs.component';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';

@NgModule({
   declarations: [
      SigmaBeaconTabsComponent,
      SigmaBeaconTabContentComponent,
      SigmaBeaconSquareRadioComponent,
      SigmaBeaconSquareRadioContentComponent
   ],
   imports: [
      SigmaBeaconSharedModule,
      RouterModule
   ],
   exports: [
      SigmaBeaconTabsComponent,
      SigmaBeaconTabContentComponent,
      SigmaBeaconSquareRadioComponent,
      SigmaBeaconSquareRadioContentComponent,
      RouterModule
   ]
})
export class SigmaBeaconComponentModule {


}

