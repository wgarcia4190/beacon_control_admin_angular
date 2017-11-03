import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal/dist';

import { Activity } from '../../../../model/entities/activity';
import { SigmaActivityService } from '../../../../model/services/sigma.activity.service';
import { SigmaBeaconUtility } from '../../../../utils/sigma.beacon.utility';
import { SigmaBeaconModalDialogComponent } from '../../../components/sigma.beacon.modal.dialog.component';

@Component({
   selector: 'sigma-beacon-activity-list',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.activity.list.component.html',
   styleUrls: [
      '../../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../../assets/resources/css/sigma.beacon.application.activities.scss'
   ]
})
export class SigmaBeaconActivityListComponent implements OnInit {

   @Input() private activitiesEmitter: EventEmitter<any>;

   private actionsSelected: Array<number> = [];
   private urlActions: Array<Activity> = [];
   private customActions: Array<Activity> = [];
   private coupons: Array<Activity> = [];
   private requestActions: Array<Activity> = [];

   constructor(private dialogService: DialogService, private activityService: SigmaActivityService,
      private beaconUtility: SigmaBeaconUtility) { }

   public ngOnInit(): void {
      this.activitiesEmitter.subscribe(data => {
         const activitiesArray = JSON.parse(data.data.activities);
         for (let activityJson of activitiesArray) {
            const activity: Activity = activityJson;

            switch (activity.scheme) {
               case 'custom':
                  this.customActions.push(activity);
                  break;
               case 'url':
                  this.urlActions.push(activity);
                  break;
               case 'coupon':
                  this.coupons.push(activity);
                  break;
               default:
                  this.requestActions.push(activity);
                  break;
            }
         }
      });
   }

   private toggleAction(activityId: number, event: any): void {
      if (event.target.checked)
         this.actionsSelected.push(activityId);
      else {
         const index = this.actionsSelected.indexOf(activityId);
         if (index > -1)
            this.actionsSelected.splice(index, 1);
      }
   }

   private onShowDeleteModal(activityId: number, index: number, scheme: string): void {
      let disposable = this.dialogService.addDialog(SigmaBeaconModalDialogComponent, {
         title: 'Warning!',
         message: 'Are you sure you want to delete activity?',
         bottonText: 'Delete',
         bottonClass: 'btn btn-danger btn-action-delete btn-static-width with-modal'
      }).subscribe((isConfirmed) => {
         if (isConfirmed) {
            this.beaconUtility.mainComponent.busy = this.activityService.deleteActivity(activityId).subscribe(data => {
               if (data.code === 200) {
                  switch (scheme) {
                     case 'custom':
                        this.customActions.splice(index, 1);
                        break;
                     case 'url':
                        this.urlActions.splice(index, 1);
                        break;
                     case 'coupon':
                        this.coupons.splice(index, 1);
                        break;
                     default:
                        this.requestActions.splice(index, 1);
                        break;
                  }
               }
            })
         }
      });
   }
}
