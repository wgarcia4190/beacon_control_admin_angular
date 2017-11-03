import { SigmaBeaconProfileComponent } from '../../view-controller/profile/sigma.beacon.profile.component';
import { SigmaBeaconMapComponent } from '../../view-controller/map/sigma.beacon.map.component';
import { SigmaBeaconBeaconComponent } from '../../view-controller/beacon/sigma.beacon.beacon.component';
import { SigmaBeaconHomeComponent } from '../../view-controller/home/sigma.beacon.home.component';
import { SigmaBeaconLayoutComponent } from '../../view-controller/layout/sigma.beacon.layout.component';
import { CanActivateChild, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { SigmaBeaconAuthGuard } from './guards/sigma.beacon.authentication.guard';


const ROUTES: Routes = [
    {
        path: '',
        component: SigmaBeaconLayoutComponent,
        canActivate: [SigmaBeaconAuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: SigmaBeaconHomeComponent,
                canActivate: [SigmaBeaconAuthGuard]
            },
            {
                path: 'profile',
                component: SigmaBeaconProfileComponent,
                canActivate: [SigmaBeaconAuthGuard]
            },
            {
                path: 'beacons',
                loadChildren: '../../modules/beacons/sigma.beacon.module#SigmaBeaconModule',
                canActivate: [SigmaBeaconAuthGuard],
                canActivateChild: [SigmaBeaconAuthGuard]
            }, {
                path: 'zones',
                loadChildren: '../../modules/zones/sigma.beacon.zone.module#SigmaBeaconZoneModule',
                canActivate: [SigmaBeaconAuthGuard],
                canActivateChild: [SigmaBeaconAuthGuard]
            }, {
                path: 'map',
                component: SigmaBeaconMapComponent,
                canActivate: [SigmaBeaconAuthGuard],
                canActivateChild: [SigmaBeaconAuthGuard]
            }, {
                path: 'applications',
                loadChildren: '../../modules/applications/sigma.beacon.application.module#SigmaBeaconApplicationModule',
                canActivate: [SigmaBeaconAuthGuard],
                canActivateChild: [SigmaBeaconAuthGuard]
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
export class SigmaBeaconLayoutRoutingModule {
    static routes = ROUTES;
}
