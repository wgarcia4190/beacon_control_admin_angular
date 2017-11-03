import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { SigmaBeaconAuthService } from '../../model/services/sigma.beacon.authentication.service';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';

@Component({
	selector: 'sigma-beacon-register',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.register.component.html',
	styleUrls: [
		'../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../assets/resources/css/sigma.beacon.login.scss'
	]
})
export class SigmaBeaconRegisterComponent {

	private emailExist: boolean = false;

	constructor(private authService: SigmaBeaconAuthService, private router: Router,
		private beaconUtility: SigmaBeaconUtility) { }

	public register(username: string) {
		this.beaconUtility.mainComponent.busy = this.authService.register(username).subscribe((data) => {
			if (data.code === 301) {
				this.emailExist = true;
			} else if (data.code === 200) {
				this.router.navigate(['/login']);
			}

		}, (error) => {
			console.log(error);
		});
	}
}