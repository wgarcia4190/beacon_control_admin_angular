import { SigmaBeaconConfirmationComponent } from '../../view-controller/login/sigma.beacon.confirmation.component';
import { SigmaBeaconRegisterComponent } from '../../view-controller/register/sigma.beacon.register.component';
import { SigmaBeaconLoginComponent } from '../../view-controller/login/sigma.beacon.login.component';
import { CanActivateChild, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { SigmaBeaconAuthGuard } from './guards/sigma.beacon.authentication.guard';


const ROUTES: Routes = [
   {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
   }, {
      path: 'login',
      component: SigmaBeaconLoginComponent
   }, {
      path: 'confirmation',
      component: SigmaBeaconConfirmationComponent
   }, {
      path: 'register',
      component: SigmaBeaconRegisterComponent
   }, {
      path: 'app',
      loadChildren: '../../modules/layout/sigma.beacon.layout.module#SigmaBeaconLayoutModule',
      canActivate: [SigmaBeaconAuthGuard],
      canActivateChild: [SigmaBeaconAuthGuard]
   }
];

@NgModule({
   imports: [
      RouterModule.forRoot(ROUTES, { useHash: true })
   ],
   exports: [RouterModule]
})
export class SigmaBeaconMainRoutingModule {
   static routes = ROUTES;
}
