import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { SigmaBeaconAuthService } from '../../model/services/sigma.beacon.authentication.service';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';

@Component({
	selector: 'sigma-beacon-confirmation',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.confirmation.component.html',
	styleUrls: [
		'../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../assets/resources/css/sigma.beacon.login.scss'
	]
})
export class SigmaBeaconConfirmationComponent implements OnInit, OnDestroy {

	private confirmationToken: string;
	private parameterSubscription: Subscription;

	constructor(private activatedRoute: ActivatedRoute,
		private sigmaBeaconAuthService: SigmaBeaconAuthService,
		private beaconUtility: SigmaBeaconUtility,
		private router: Router) { }

	public ngOnInit(): void {
		this.parameterSubscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
			this.confirmationToken = params['confirmation_token'];

			this.sigmaBeaconAuthService.confirmUser(this.confirmationToken).subscribe();
		})
	}

	private setPassword(securityToken: string, password: string, confirmPassword: string): void {
		if (password === confirmPassword) {
			this.beaconUtility.mainComponent.busy = this.sigmaBeaconAuthService.setPassword(this.confirmationToken, securityToken, password).subscribe((data) => {
				if (data.code === 200) {
					this.router.navigate(['/login']);
				}
			}, (error) => {
				console.log(error);
			});
		}
	}

	public ngOnDestroy(): void {
		if (this.parameterSubscription) {
			this.parameterSubscription.unsubscribe();
		}
	}

}