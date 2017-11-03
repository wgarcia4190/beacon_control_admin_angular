import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Activity } from '../../../../model/entities/Activity';
import { Beacon } from '../../../../model/entities/beacon';
import { Zone } from '../../../../model/entities/Zone';
import { SigmaActivityService } from '../../../../model/services/sigma.activity.service';
import { SigmaBeaconService } from '../../../../model/services/sigma.beacon.service';
import { SigmaZoneService } from '../../../../model/services/sigma.zone.service';
import { SigmaBeaconSessionManagement } from '../../../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../../../utils/sigma.beacon.utility';
import { SigmaBeaconSquareRadioContentComponent } from '../../../components/sigma.beacon.square.radio.content.component';

declare const jQuery: any;

@Component({
	selector: 'sigma-beacon-url-action-crud',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.actity.url.action.crud.component.html',
	styleUrls: [
		'../../../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../../../assets/resources/css/sigma.beacon.application.activities.scss'
	]
})

export class SigmaBeaconUrlActionCrudComponent implements OnInit, AfterViewInit {

	private isEdit: boolean = false;
	private appId: number;
	private appName: string;
	private activityId: number;
	private beacons: Array<Beacon> = new Array<Beacon>();
	private selectedBeacons: Array<Beacon> = new Array<Beacon>();
	private zones: Array<Zone> = new Array<Zone>();
	private selectedZones: Array<Zone> = new Array<Zone>();
	private activity: Activity = new Activity();
	private showErrorMessage: boolean = false;

	private validForm: FormGroup;

	@ViewChild('typeActions') private typeSquareRadioContent: SigmaBeaconSquareRadioContentComponent;
	@ViewChild('beaconActions') private beaconSquareRadioContent: SigmaBeaconSquareRadioContentComponent;
	@ViewChild('zoneActions') private zoneSquareRadioContent: SigmaBeaconSquareRadioContentComponent;

	constructor(private beaconUtility: SigmaBeaconUtility, private router: ActivatedRoute,
		private beaconService: SigmaBeaconService, private zoneService: SigmaZoneService,
		private activityService: SigmaActivityService, private changeDetector: ChangeDetectorRef,
		private sessionManagement: SigmaBeaconSessionManagement, private route: Router,
		formBuilder: FormBuilder) {

		this.isEdit = router.snapshot.data['editable'];
		this.appId = router.snapshot.params.id;
		this.appName = router.snapshot.params.app_name;
		this.activityId = router.snapshot.params.activityId;
		this.activity.scheme = 'url';

		this.validForm = formBuilder.group({
			'activityName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'activityUrl': [null, Validators.compose([Validators.required, Validators.minLength(3)])]
		});

		if (this.isEdit) {
			this.activity.id = this.activityId;
			this.beaconUtility.mainComponent.busy = this.activityService.getActivityById(this.activityId).subscribe(data => {
				if (data.code === 200) {
					data = JSON.parse(data.data);
					this.activity.fromJsons(JSON.parse(data.activity), JSON.parse(data.trigger));

					if (this.activity.trigger.type === 'BeaconTrigger')
						this.selectedBeacons = JSON.parse(data.sources);
					else
						this.selectedZones = JSON.parse(data.sources);

					this.validForm.controls['activityName'].setValue(this.activity.name);
					this.validForm.controls['activityUrl'].setValue(this.activity.payload);
					this.typeSquareRadioContent.setSelected(this.activity.trigger.type);
					if (this.activity.trigger.type === 'BeaconTrigger')
						this.beaconSquareRadioContent.setSelected(this.activity.trigger.eventType);
					else
						this.zoneSquareRadioContent.setSelected(this.activity.trigger.eventType);

					if (this.beacons.length > 0) {
						this.beacons.forEach((beacon, index) => {
							this.selectedBeacons.forEach((selectedBeacon) => {
								if (beacon.id === selectedBeacon.id) {
									this.beacons.splice(index, 1);
								}
							});
						})
					}

					if (this.zones.length > 0) {
						this.zones.forEach((zone, index) => {
							this.selectedZones.forEach((selectedZone) => {
								if (zone.id === selectedZone.id) {
									this.zones.splice(index, 1);
								}
							});
						})
					}
				}
			});
		}
	}

	public ngOnInit(): void {
		this.beaconUtility.mainComponent.busy = this.beaconService.getBeacons().subscribe(data => {
			if (data.code === 200) {
				const beaconArray = JSON.parse(data.data);
				beaconArray.forEach((beacon: any) => {
					const newBeacon: Beacon = new Beacon();
					newBeacon.fromJson(beacon);
					this.beacons.push(newBeacon);
				});

				if (this.selectedBeacons.length > 0) {
					this.beacons.forEach((beacon, index) => {
						this.selectedBeacons.forEach((selectedBeacon) => {
							if (beacon.id === selectedBeacon.id) {
								this.beacons.splice(index, 1);
							}
						});
					})
				}

				this.changeDetector.detectChanges();

				setTimeout(() => {
					jQuery('.selectpicker').selectpicker('refresh');
				}, 50);

			}
		});

		this.zoneService.getZones().subscribe(data => {
			if (data.code === 200) {
				const zoneArray = JSON.parse(data.data);
				zoneArray.forEach((zone: any) => {
					const newZone: Zone = new Zone();
					newZone.fromJson(zone);
					this.zones.push(newZone);
				});

				if (this.selectedZones.length > 0) {
					this.zones.forEach((zone, index) => {
						this.selectedZones.forEach((selectedZone) => {
							if (zone.id === selectedZone.id) {
								this.zones.splice(index, 1);
							}
						});
					})
				}

				this.changeDetector.detectChanges();

				setTimeout(() => {
					jQuery('.selectpicker').selectpicker('refresh');
				}, 50);
			}
		});
	}

	public ngAfterViewInit(): void {
		jQuery('.selectpicker').selectpicker();
		jQuery('.slider').slider();

		jQuery('.slider').on('slide', function (slideEvt) {
			jQuery('#dwell_time_preview').val(`${slideEvt.value} min`)
		});
		this.beaconUtility.breadcrumbEmitter.emit([{
			'isLeaf': false,
			'value': 'Applications',
			'routes': ['applications', 'list']
		}, {
			'isLeaf': false,
			'value': this.appName.toUpperCase(),
			'routes': ['applications', this.appId, this.appName, 'activities']
		}, {
			'isLeaf': true,
			'value': this.isEdit ? 'EDIT CUSTOM ACTION' : 'ADD NEW CUSTOM ACTION'
		}]);
	}

	private addBeaconToActivity(beaconId: number): void {
		this.showErrorMessage = false;
		this.beacons.some((beacon, index) => {
			if (beacon.id == beaconId) {
				this.selectedBeacons.push(this.beacons.splice(index, 1)[0]);
				return true;
			}
			return false;
		});

		this.changeDetector.detectChanges();
		setTimeout(() => {
			jQuery('.selectpicker').selectpicker('refresh');
		}, 50);
	}

	private removeBeaconFromActivity(beaconId: number): void {
		this.selectedBeacons.some((beacon, index) => {
			if (beacon.id == beaconId) {
				this.beacons.push(this.selectedBeacons.splice(index, 1)[0]);
				return true;
			}
			return false;
		});

		this.changeDetector.detectChanges();
		setTimeout(() => {
			jQuery('.selectpicker').selectpicker('refresh');
		}, 50);
	}

	private addZoneToActivity(zoneId: number): void {
		this.showErrorMessage = false;
		this.zones.some((zone, index) => {
			if (zone.id == zoneId) {
				this.selectedZones.push(this.zones.splice(index, 1)[0]);
				return true;
			}
			return false;
		});

		this.changeDetector.detectChanges();
		setTimeout(() => {
			jQuery('.selectpicker').selectpicker('refresh');
		}, 50);
	}

	private removeZoneFromActivity(zoneId: number): void {
		this.selectedZones.some((zone, index) => {
			if (zone.id == zoneId) {
				this.zones.push(this.selectedZones.splice(index, 1)[0]);
				return true;
			}
			return false;
		});

		this.changeDetector.detectChanges();
		setTimeout(() => {
			jQuery('.selectpicker').selectpicker('refresh');
		}, 50);
	}

	private saveActivity(): void {
		const triggerType: string = this.typeSquareRadioContent.getSelected().$value;
		let triggerEventType: string;
		const sources: Array<any> = new Array<any>();

		if (triggerType === 'BeaconTrigger') {
			triggerEventType = this.beaconSquareRadioContent.getSelected().$value;
			this.selectedBeacons.forEach((beacon) => {
				sources.push({
					'source_id': beacon.id,
					'source_type': 'Beacon'
				});
			});
			if (this.selectedBeacons.length === 0) {
				this.showErrorMessage = true;
			}
		} else {
			triggerEventType = this.zoneSquareRadioContent.getSelected().$value;
			this.selectedZones.forEach((zone) => {
				sources.push({
					'source_id': zone.id,
					'source_type': 'Zone'
				});
			});
			if (this.selectedBeacons.length === 0) {
				this.showErrorMessage = true;
			}
		}

		if (this.validForm.controls['activityName'].valid && this.validForm.controls['activityUrl'].valid) {
			jQuery('.activityName.required').removeClass('has-error');

			this.activity.trigger.applicationId = this.sessionManagement.user.applicationId;
			this.activity.trigger.eventType = triggerEventType;
			this.activity.trigger.type = triggerType;
			this.activity.trigger.sources = sources;

			this.activity.name = this.validForm.controls['activityName'].value;
			this.activity.payload = this.validForm.controls['activityUrl'].value;

			if (!this.showErrorMessage) {
				this.beaconUtility.mainComponent.busy = this.activityService.saveActivity(this.activity).subscribe(data => {
					if (data.code === 200) {
						this.route.navigate(['/app', 'applications', this.appId, this.appName, 'activities']);
					}
				});
			}

		} else {
			jQuery('.activityName.required').addClass('has-error');
			jQuery('.activityName.required').focus();
		}
	}
}