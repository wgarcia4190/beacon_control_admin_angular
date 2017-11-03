import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { GrowlType } from '../../model/entities/growl.type.enum';
import { SigmaBeaconAuthService } from '../../model/services/sigma.beacon.authentication.service';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';

@Component({
    selector: 'sigma-beacon-login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './sigma.beacon.login.component.html',
    styleUrls: [
        '../../../assets/resources/css/sigma.beacon.general.scss',
        '../../../assets/resources/css/sigma.beacon.login.scss'
    ]
})
export class SigmaBeaconLoginComponent {

    constructor(private authService: SigmaBeaconAuthService, private router: Router,
        private beaconUtility: SigmaBeaconUtility) { }

    public login(username: string, password: string) {
        this.beaconUtility.mainComponent.busy = this.authService.login(username, password).subscribe((data) => {
            if (data.code === 200) {
                this.router.navigate(['/app', 'home']);
            }
        }, (error) => {
            if (error.message)
                this.beaconUtility.showGrowlMessage('Authentication Error', error.message, GrowlType.ERROR);
        });
    }
}
