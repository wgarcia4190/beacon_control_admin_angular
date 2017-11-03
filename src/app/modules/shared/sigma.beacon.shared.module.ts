import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { CommonModule } from '@angular/common';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NgModule } from '@angular/core';
import { BusyModule } from 'angular2-busy';
import { ToastyModule } from 'ng2-toasty';

import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaBeaconHttpExtention } from '../../extends/sigma.beacon.http.extension';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconHttpFactory } from '../../extends/sigma.beacon.http.factory';
import { SigmaBeaconRolesDirective } from '../../utils/directives/sigma.beacon.role.directive';

import '../../extends/sigma.date.extention';

@NgModule({
   imports: [
      ToastyModule.forRoot()
   ],
   declarations: [
      SigmaBeaconRolesDirective
   ],
   exports: [
      HttpModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule,
      SigmaBeaconRolesDirective,
      BusyModule,
      ToastyModule
   ],
   providers: [
      AppConfig,
      SigmaBeaconSessionManagement,
      SigmaBeaconUtility,
      {
         provide: Http,
         useFactory: SigmaBeaconHttpFactory,
         deps: [XHRBackend, RequestOptions, AppConfig, SigmaBeaconSessionManagement]

      }
   ]
})
export class SigmaBeaconSharedModule {

}
