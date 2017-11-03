import { AfterViewInit, Component, OnDestroy, Renderer, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Activity } from '../../../model/entities/activity';
import { Beacon } from '../../../model/entities/beacon';
import { BeaconType } from '../../../model/entities/beacon.type.enum';
import { Floor } from '../../../model/entities/floor';
import { Trigger } from '../../../model/entities/trigger';
import { Zone } from '../../../model/entities/zone';
import { SigmaActivityService } from '../../../model/services/sigma.activity.service';
import { SigmaBeaconService } from '../../../model/services/sigma.beacon.service';
import { SigmaBeaconSessionManagement } from '../../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';

declare const jQuery: any;
declare const google: any;

@Component({
   selector: 'sigma-beacon-new-beacon',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.crud.beacon.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.tabs.scss',
      '../../../../assets/resources/css/sigma.beacon.crud.scss'
   ]

})
export class SigmaBeaconCrudBeaconComponent implements AfterViewInit, OnDestroy {

   private validForm: FormGroup;
   private footerButtons: Array<any>;
   private validatorsPerTab: any;
   private beacon: Beacon = new Beacon();
   private isEdit: boolean = false;
   private urlSubscription: Subscription;

   private isSaving: boolean = false;
   private dataValidator = (type: string) => {
      return (control: FormControl) => {
         if (jQuery('#beacon_protocol option:selected').text() === type) {
            return control.value == null || control.value.length === 0 ? { 'required': true } : null;
         } else {
            return null;
         }
      }
   }


   constructor(private beaconUtility: SigmaBeaconUtility, private renderer: Renderer,
      private beaconService: SigmaBeaconService, private activityService: SigmaActivityService,
      private route: Router, private sessionManagement: SigmaBeaconSessionManagement,
      formBuilder: FormBuilder, router: ActivatedRoute) {

      this.isEdit = router.snapshot.data['editable'];
      this.createFooterButton();

      if (this.isEdit) {
         this.urlSubscription = router.params.subscribe(params => {
            this.beaconService.getBeaconById(params['id']).subscribe(beaconData => {
               this.beacon.fromJson(JSON.parse(beaconData.data));

               const controls = this.validForm.controls;
               controls['beaconName'].setValue(this.beacon.name, { emitEvent: false });
               controls['beaconUUID'].setValue(this.beacon.uuid, { emitEvent: false });
               controls['beaconLocation'].setValue(this.beacon.location, { emitEvent: false });
               controls['beaconLat'].setValue(this.beacon.lat, { emitEvent: true });
               controls['beaconLng'].setValue(this.beacon.lng, { emitEvent: true });
               controls['beaconType'].setValue(this.beacon.type.toString(), { emitEvent: true });
               controls['beaconFloor'].setValue(this.beacon.floor.name, { emitEvent: false });
               controls['beaconZone'].setValue(this.beacon.zone.code, { emitEvent: false });
               controls['beaconVendor'].setValue(this.beacon.vendor, { emitEvent: false });

               jQuery('.selectpicker').selectpicker('refresh');

               if (this.beacon.type.toString() === 'Eddystone') {
                  jQuery('.eddystone-container').css('display', 'block');
                  jQuery('.ibeacon-container').css('display', 'none');
               }

               if (this.beacon.zone.code) {
                  jQuery('.btn-group.bootstrap-select.select-with-border').css('border-color', this.beacon.zone.color);
               }

               for (const beaconData of this.beacon.data) {
                  switch (beaconData.name) {
                     case 'minor':
                        controls['beaconMinor'].setValue(beaconData.value, { emitEvent: false });
                        break;
                     case 'major':
                        controls['beaconMajor'].setValue(beaconData.value, { emitEvent: false });
                        break;
                     case 'namespace':
                        controls['beaconNamespace'].setValue(beaconData.value, { emitEvent: false });
                        break;
                     case 'instance':
                        controls['beaconInstance'].setValue(beaconData.value, { emitEvent: false });
                        break;
                     default:
                        controls['beaconInterval'].setValue(beaconData.value, { emitEvent: false });
                        break;
                  }
               }

            });
         });
      }

      this.validForm = formBuilder.group({
         'beaconName': [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         'beaconUUID': [null, Validators.compose([Validators.required, Validators.minLength(32)])],
         'beaconMajor': [null, this.dataValidator('iBeacon')],
         'beaconMinor': [null, this.dataValidator('iBeacon')],
         'beaconNamespace': [null, this.dataValidator('Eddystone')],
         'beaconInstance': [null, this.dataValidator('Eddystone')],
         'beaconInterval': [null, this.dataValidator('Eddystone')],
         'beaconLocation': [null],
         'beaconZone': [null],
         'beaconType': [null],
         'beaconVendor': [null],
         'beaconFloor': [null],
         'beaconLat': [null],
         'beaconLng': [null],
         'beaconTestActivity': [null],
         'beaconActivityName': [null],
         'beaconAttributeText': [null],
         'beaconTriggerType': [null]
      });

      this.validForm.controls['beaconActivityName'].setValue("Hello world!");
      this.validForm.controls['beaconAttributeText'].setValue("Your beacon is working.");

      this.validatorsPerTab = {
         'Basic': ['beaconName'],
         'Settings': ['beaconUUID', 'beaconMajor', 'beaconMinor', 'beaconNamespace', 'beaconInstance', 'beaconInterval']
      };
   }

   public ngAfterViewInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': false,
         'value': 'Beacons',
         'routes': ['beacons', 'list']
      }, {
         'isLeaf': true,
         'value': 'Add Beacons'
      }]);
   }

   private createFooterButton(): void {
      if (!this.isEdit) {
         this.footerButtons = [{
            'id': 'nextTab',
            'cssClass': 'btn-action-save',
            'label': 'Next',
            'displayStyle': 'inline-block',
            'event': (data) => {
               const actualTab = `#${data[1]}-link`;
               const event = new MouseEvent('click', { bubbles: true });
               this.renderer.invokeElementMethod(
                  jQuery(actualTab)[0], 'dispatchEvent', [event]);
            }
         }, {
            'id': 'endTab',
            'cssClass': 'btn-action-save',
            'label': 'Save Beacon',
            'displayStyle': 'none',
            'event': (data, currentTab) => {
               const validators = this.validatorsPerTab[currentTab];
               let hasErrors = false;

               for (const validator of validators) {
                  const selector = `.${validator}.required`;
                  const validatorObject = this.validForm.controls[validator];

                  if (validatorObject.enabled && !validatorObject.valid) {
                     jQuery(selector).addClass('has-error');
                     hasErrors = true;
                  } else {
                     jQuery(selector).removeClass('has-error');
                     this.saveBeacon();
                  }
               }
               if (hasErrors) {
                  return;
               }
            }
         }];
      } else {
         this.footerButtons = [{
            'id': 'endTab',
            'cssClass': 'btn-action-save',
            'label': 'Save Beacon',
            'displayStyle': 'inline-block',
            'event': (data) => {
               let hasErrors = false;
               for (const currentTab of data) {
                  const validators = this.validatorsPerTab[currentTab];

                  for (const validator of validators) {
                     const selector = `.${validator}.required`;
                     const validatorObject = this.validForm.controls[validator];

                     if (validatorObject.enabled && !validatorObject.valid) {
                        jQuery(selector).addClass('has-error');
                        hasErrors = true;
                     } else {
                        jQuery(selector).removeClass('has-error');
                        this.saveBeacon();
                     }
                  }
               }
               if (hasErrors) {
                  return;
               }
            }
         }]
      }
   }

   private saveBeacon(): void {
      if (!this.isSaving) {
         this.isSaving = true;

         this.beacon.name = this.validForm.controls['beaconName'].value;
         this.beacon.uuid = this.validForm.controls['beaconUUID'].value;
         this.beacon.location = this.validForm.controls['beaconLocation'].value;
         this.beacon.lat = this.validForm.controls['beaconLat'].value;
         this.beacon.lng = this.validForm.controls['beaconLng'].value;
         this.beacon.lng = this.validForm.controls['beaconLng'].value;
         this.beacon.floor = new Floor();

         const zoneData = this.validForm.controls['beaconZone'].value;
         const floor = this.validForm.controls['beaconFloor'].value;
         if (zoneData) {
            const zone: Zone = new Zone();
            zone.id = zoneData.split('-')[0];
            if (zone.id != 0)
               this.beacon.zone = zone;
         }

         this.beacon.floor.name = !floor ? '0' : floor === 'N/A' ? '0' : floor;

         const type = this.validForm.controls['beaconType'].value;
         const vendor = this.validForm.controls['beaconVendor'].value;
         this.beacon.type = !type || type === 'iBeacon' ? BeaconType.IBEACON : BeaconType.EDDYSTONE;
         this.beacon.vendor = !vendor ? 'Beaconinside' : vendor;

         let data = new Array<any>();
         if (this.beacon.type === BeaconType.IBEACON) {
            data = [{
               'name': 'minor',
               'value': this.validForm.controls['beaconMinor'].value
            }, {
               'name': 'major',
               'value': this.validForm.controls['beaconMajor'].value
            }];
         } else {
            data = [{
               'name': 'namespace',
               'value': this.validForm.controls['beaconNamespace'].value
            }, {
               'name': 'instance',
               'value': this.validForm.controls['beaconInstance'].value
            }, {
               'name': 'interval',
               'value': this.validForm.controls['beaconInterval'].value
            }];
         }

         this.beacon.data = data;
         this.beacon.config = {
            'status': 'Active',
            'device_id': 'Unknown',
            'vendor': this.beacon.vendor,
            'firmware': 'Unknown',
            'battery': 'Unknown',
            'last_action': new Date(),
            'average_connection_intervals': 'Unknown'
         }

         this.beacon.hasTrigger = !this.validForm.controls['beaconTestActivity'].value ? false : true;

         this.beaconUtility.mainComponent.busy = this.beaconService.saveBeacon(this.beacon).subscribe(data => {
            this.isSaving = false;
            if (data.code === 200) {
               if (this.beacon.hasTrigger) {
                  const trigger: Trigger = new Trigger();
                  trigger.type = 'BeaconTrigger';
                  trigger.test = true;
                  trigger.sources.push({
                     'source_id': data.data,
                     'source_type': 'Beacon'
                  });
                  trigger.applicationId = this.sessionManagement.user.applicationId;
                  trigger.eventType = this.validForm.controls['beaconTriggerType'].value ? this.validForm.controls['beaconTriggerType'].value : 'enter';

                  const activity: Activity = new Activity();
                  activity.name = this.validForm.controls['beaconActivityName'].value;
                  activity.payload = "{}";
                  activity.scheme = 'custom';
                  activity.trigger = trigger;
                  activity.customAttributes.push({
                     'name': 'text',
                     'value': this.validForm.controls['beaconAttributeText'].value
                  });

                  this.activityService.saveActivity(activity).subscribe();
               }
               this.route.navigate(['/app', 'beacons', 'list']);
            }
         }, (error) => {
            console.log(error);
         });
      }
   }

   public ngOnDestroy(): void {
      if (this.urlSubscription != null) {
         this.urlSubscription.unsubscribe();
      }
   }
}
