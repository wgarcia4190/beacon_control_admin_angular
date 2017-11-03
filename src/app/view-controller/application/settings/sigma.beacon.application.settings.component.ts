import { Component, Input, OnInit } from '@angular/core';
import { EventEmitter, ViewEncapsulation } from 'ng2-bootstrap-growl/node_modules/@angular/core';
import { selector } from 'rxjs/operator/publish';

import { Application } from '../../../model/entities/application';

@Component({
	selector: 'sigma-beacon-application-settings',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.application.settings.component.html',
	styleUrls: ['../../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../../assets/resources/css/sigma.beacon.application.settings.scss']

})
export class SigmaBeaconApplicationSettingsComponent implements OnInit {

	@Input() private applicationEmitter: EventEmitter<any>;
	private application: Application = new Application();

	public ngOnInit(): void {
		this.applicationEmitter.subscribe(data => {
			this.application.fromJson(data.data);
		});
	}

}