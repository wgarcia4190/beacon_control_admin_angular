import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppConfig } from '../../config/sigma.beacon.config';
import { SigmaBeaconLoginComponent } from '../../view-controller/login/sigma.beacon.login.component';
import { SigmaBeaconRegisterComponent } from '../../view-controller/register/sigma.beacon.register.component';
import { SigmaBeaconAuthGuard } from '../../config/routes/guards/sigma.beacon.authentication.guard';
import { SigmaBeaconMainRoutingModule } from '../../config/routes/sigma.beacon.main.routing';
import { SigmaBeaconSharedModule } from '../shared/sigma.beacon.shared.module';
import { SigmaBeaconMainComponent } from '../../view-controller/main/sigma.beacon.main.component';
import { SigmaBeaconAuthService } from '../../model/services/sigma.beacon.authentication.service';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconConfirmationComponent } from '../../view-controller/login/sigma.beacon.confirmation.component';
import { SigmaBeaconModalDialogComponent } from '../../view-controller/components/sigma.beacon.modal.dialog.component';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';


@NgModule({
  declarations: [
    SigmaBeaconMainComponent,
    SigmaBeaconLoginComponent,
    SigmaBeaconConfirmationComponent,
    SigmaBeaconRegisterComponent,
    SigmaBeaconModalDialogComponent
  ],
  imports: [
    SigmaBeaconSharedModule,
    SigmaBeaconMainRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    BootstrapModalModule
  ],
  providers: [
    SigmaBeaconAuthGuard,
    SigmaBeaconAuthService
  ],
  entryComponents: [
    SigmaBeaconModalDialogComponent
  ],
  bootstrap: [SigmaBeaconMainComponent]
})
export class SigmaBeaconMainModule {
  constructor(private sessionManager: SigmaBeaconSessionManagement, private appConfig: AppConfig,
    private beaconUtility: SigmaBeaconUtility) {
    window['sessionManager'] = this.sessionManager;
    window['appConfig'] = this.appConfig;
    window['beaconUtility'] = this.beaconUtility;
  }

}

