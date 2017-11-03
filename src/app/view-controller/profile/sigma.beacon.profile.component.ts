import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SigmaBeaconProfileService } from '../../model/services/sigma.profile.service';
import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';

@Component({
	selector: 'sigma-beacon-profile',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.profile.component.html',
	styleUrls: [
		'../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../assets/resources/css/sigma.beacon.profile.scss'
	]
})
export class SigmaBeaconProfileComponent implements OnInit {

	private defaultUUID: string = '';
	private validForm: FormGroup;

	private beaconuuidMask = [/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
		/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-',
		/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
		/[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
		/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/];

	constructor(private beaconUtility: SigmaBeaconUtility,
		private sigmaBeaconSessionManagement: SigmaBeaconSessionManagement,
		private sigmaBeaconProfileService: SigmaBeaconProfileService,
		private formBuilder: FormBuilder) {

		this.validForm = formBuilder.group({
			'beaconUUID': [null, Validators.compose([Validators.required, Validators.minLength(32)])]
		});

	}

	public ngOnInit(): void {
		this.beaconUtility.breadcrumbEmitter.emit([{
			'isLeaf': true,
			'value': 'Profile'
		}]);

		this.defaultUUID = this.sigmaBeaconSessionManagement.user.factoryUUID;
	}

	public updateUser(properties: any, checkForm): void {
		if (checkForm) {
			const data = this.validForm.controls['beaconUUID'].value.replace(/_/g, '')
			if (data.length < 32) {
				return;
			}
		}


		if (properties.hasOwnProperty('password')) {
			if (properties['password'] !== properties['password2']) {
				return;
			}
		}


		this.beaconUtility.mainComponent.busy = this.sigmaBeaconProfileService.updateUser(properties).subscribe(data => {
			if (data.code === 200) {
				this.sigmaBeaconSessionManagement.user.fromJSON(data.data);
			}
		});
	}

}