import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ElementRef,
   OnInit,
   Renderer2,
   ViewChild,
   ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Activity } from '../../../../model/entities/activity';
import { Beacon } from '../../../../model/entities/beacon';
import { Coupon } from '../../../../model/entities/coupon';
import { Zone } from '../../../../model/entities/zone';
import { SigmaActivityService } from '../../../../model/services/sigma.activity.service';
import { SigmaBeaconService } from '../../../../model/services/sigma.beacon.service';
import { SigmaZoneService } from '../../../../model/services/sigma.zone.service';
import { SigmaBeaconSessionManagement } from '../../../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../../../utils/sigma.beacon.utility';
import { SigmaBeaconSquareRadioContentComponent } from '../../../components/sigma.beacon.square.radio.content.component';

declare const jQuery: any;

@Component({
	selector: 'sigma-beacon-coupon-crud',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.activity.coupon.crud.component.html',
	styleUrls: [
		'../../../../../assets/resources/css/sigma.beacon.general.scss',
		'../../../../../assets/resources/css/sigma.beacon.application.activities.scss',
		'../../../../../assets/resources/css/sigma.beacon.coupon.scss'
	]
})
export class SigmaBeaconCouponCrudComponent implements OnInit, AfterViewInit {

	private isEdit: boolean = false;
	private selectedTemplate: string = 'template_1';

	private couponImageBackground: string = './assets/resources/imgs/coupon/image.png';
	private couponLogo: string = './assets/resources/imgs/coupon/logo.png';
	private qrType: string = 'qr_code';
	private buttonBackground: string = '#000000';
	private buttonTextColor: string = '#000000';
	private couponName: string;
	private couponTitle: string;
	private couponDescription: string;
	private buttonLabel: string;
	private buttonLink: string;

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

	private templateValidator = (...types: string[]) => {
		return (control: FormControl) => {
			let containsTemplate: boolean = false;
			for (let type in types) {
				if (jQuery('#template_selector option:selected').text() === type) {
					containsTemplate = true;
					break;
				} else {
					containsTemplate = false;
				}
			}

			if (containsTemplate) {
				return control.value == null || control.value.length === 0 ? { 'required': true } : null;
			} else {
				return null;
			}
		}
	}

	@ViewChild('typeActions') private typeSquareRadioContent: SigmaBeaconSquareRadioContentComponent;
	@ViewChild('beaconActions') private beaconSquareRadioContent: SigmaBeaconSquareRadioContentComponent;
	@ViewChild('zoneActions') private zoneSquareRadioContent: SigmaBeaconSquareRadioContentComponent;
	@ViewChild('logoContainer') private logoContainer: ElementRef;
	@ViewChild('qrContainer') private qrContainer: ElementRef;
	@ViewChild('buttonContainer') private buttonContainer: ElementRef;

	constructor(private beaconUtility: SigmaBeaconUtility, private router: ActivatedRoute,
		private renderer: Renderer2, private beaconService: SigmaBeaconService,
		private zoneService: SigmaZoneService, private activityService: SigmaActivityService,
		private changeDetector: ChangeDetectorRef, private sessionManagement: SigmaBeaconSessionManagement,
		private route: Router, formBuilder: FormBuilder) {

		this.isEdit = router.snapshot.data['editable'];
		this.appId = router.snapshot.params.id;
		this.appName = router.snapshot.params.app_name;
		this.activityId = router.snapshot.params.activityId;
		this.activity.scheme = 'coupon';

		this.validForm = formBuilder.group({
			'couponName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'activityName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'couponTitle': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'couponDesc': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
			'couponUUID': [null, Validators.compose([this.templateValidator('template_3', 'template_4'), Validators.minLength(3)])],
			'couponID': [null, Validators.compose([this.templateValidator('template_3', 'template_4'), Validators.minLength(3)])],
			'buttonLabel': [null, this.templateValidator('template_5')],
			'buttonLink': [null, this.templateValidator('template_5')]
		});

		if (this.isEdit) {
			this.activity.id = this.activityId;
			this.beaconUtility.mainComponent.busy = this.activityService.getCouponById(this.activityId).subscribe(data => {
				if (data.code === 200) {
					data = JSON.parse(data.data);
					this.activity.fromJsons(JSON.parse(data.activity), JSON.parse(data.trigger));

					if (this.activity.trigger.type === 'BeaconTrigger')
						this.selectedBeacons = JSON.parse(data.sources);
					else
						this.selectedZones = JSON.parse(data.sources);

					this.typeSquareRadioContent.setSelected(this.activity.trigger.type);
					this.selectedTemplate = this.activity.coupon.template;
					this.couponDescription = this.activity.coupon.description;
					this.couponName = this.activity.coupon.name;
					this.couponTitle = this.activity.coupon.title;
					this.qrType = this.activity.coupon.encodingType;
					this.buttonBackground = this.activity.coupon.buttonBackgroundColor;
					this.buttonTextColor = this.activity.coupon.buttonFontColor;

					this.validForm.controls['activityName'].setValue(this.activity.name);
					this.validForm.controls['couponUUID'].setValue(this.activity.coupon.uniqueIdentifierNumber);
					this.validForm.controls['couponID'].setValue(this.activity.coupon.identifierNumber);
					this.validForm.controls['buttonLabel'].setValue(this.activity.coupon.buttonLabel);
					this.validForm.controls['buttonLink'].setValue(this.activity.coupon.buttonLink);
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
		const self = this;

		jQuery('.selectpicker').selectpicker();
		jQuery(".pick-a-color").pickAColor({
			showSavedColors: false,
			showAdvanced: false,
			showSpectrum: false
		});

		jQuery('.slider').slider();
		jQuery('.slider').on('slide', function (slideEvt) {
			jQuery('#dwell_time_preview').val(`${slideEvt.value} min`)
		});

		jQuery("#buttonBackground").on("change", function () {
			self.buttonBackground = '#' + jQuery(this).val();
		});
		jQuery("#buttonTextColor").on("change", function () {
			self.buttonTextColor = '#' + jQuery(this).val();
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

	private changeTemplateType(event: any): void {
		this.selectedTemplate = event.target.value;
		switch (this.selectedTemplate) {
			case 'template_1':
				this.renderer.setStyle(this.logoContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.qrContainer.nativeElement, 'display', 'none');
				this.renderer.setStyle(this.buttonContainer.nativeElement, 'display', 'none');
				break;
			case 'template_2':
				this.renderer.setStyle(this.logoContainer.nativeElement, 'display', 'none');
				this.renderer.setStyle(this.qrContainer.nativeElement, 'display', 'none');
				this.renderer.setStyle(this.buttonContainer.nativeElement, 'display', 'none');
				break;
			case 'template_3':
				this.renderer.setStyle(this.logoContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.qrContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.buttonContainer.nativeElement, 'display', 'none');
				break;
			case 'template_4':
				this.renderer.setStyle(this.logoContainer.nativeElement, 'display', 'none');
				this.renderer.setStyle(this.qrContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.buttonContainer.nativeElement, 'display', 'none');
				break;
			case 'template_5':
				this.renderer.setStyle(this.buttonContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.logoContainer.nativeElement, 'display', 'block');
				this.renderer.setStyle(this.qrContainer.nativeElement, 'display', 'none');
				break;
		}
	}

	private changeImage(fileInput: any, imageType: string): void {
		if (fileInput.target.files && fileInput.target.files[0]) {
			const self = this;
			const reader = new FileReader();

			reader.onload = function (e: any) {
				if (imageType === 'background') {
					self.couponImageBackground = e.target.result;
				} else {
					self.couponLogo = e.target.result;
				}
			}

			reader.readAsDataURL(fileInput.target.files[0]);
		} else {
			if (imageType === 'background') {
				this.couponImageBackground = './assets/resources/imgs/coupon/image.png';
			} else {
				this.couponLogo = './assets/resources/imgs/coupon/logo.png';
			}
		}
	}

	private removeImage(imageType: string): void {
		if (imageType === 'background') {
			this.couponImageBackground = './assets/resources/imgs/coupon/image.png';
		} else {
			this.couponLogo = './assets/resources/imgs/coupon/logo.png';
		}
	}

	private saveCouponActivity(): void {
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

		let hasError = false;
		for (let control in this.validForm.controls) {
			if (!this.validForm.controls[control].valid) {
				jQuery(`.${control}.required`).addClass('has-error');
				this.showErrorMessage = true;
				hasError = true;
			} else
				jQuery(`.${control}.required`).removeClass('has-error');
		}

		if (!hasError) {
			this.activity.trigger.applicationId = this.sessionManagement.user.applicationId;
			this.activity.trigger.eventType = triggerEventType;
			this.activity.trigger.type = triggerType;
			this.activity.trigger.sources = sources;

			this.activity.name = this.validForm.controls['activityName'].value;

			if (!this.showErrorMessage) {
				this.beaconUtility.mainComponent.busy = this.activityService.saveActivity(this.activity).subscribe(data => {
					if (data.code === 200) {
						this.activity.id = +data.data;

						const coupon: Coupon = new Coupon();
						coupon.name = this.validForm.controls['couponName'].value;
						coupon.title = this.validForm.controls['couponTitle'].value;
						coupon.description = this.validForm.controls['couponDesc'].value;
						coupon.template = this.selectedTemplate;
						coupon.encodingType = this.qrType;
						coupon.activityId = +data.data;
						coupon.uniqueIdentifierNumber = this.validForm.controls['couponUUID'].value;
						coupon.identifierNumber = this.validForm.controls['couponID'].value;
						coupon.buttonLink = this.validForm.controls['buttonLink'].value;
						coupon.buttonLabel = this.validForm.controls['buttonLabel'].value;
						coupon.buttonBackgroundColor = this.buttonBackground;
						coupon.buttonFontColor = this.buttonTextColor;

						this.activityService.saveCoupon(coupon).subscribe(data => {
							if (data.code === 200) {
								this.route.navigate(['/app', 'applications', this.appId, this.appName, 'activities']);
							}
						});
					}
				});
			}
		}
	}
}