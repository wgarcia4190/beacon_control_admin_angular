import { AfterViewInit, Component, EventEmitter, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { SigmaApplicationService } from '../../../model/services/sigma.application.service';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';

@Component({
   selector: 'sigma-beacon-application-activities',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.application.activities.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.application.activities.scss'
   ]
})
export class SigmaBeaconApplicationActivitiesComponent implements AfterViewInit, OnDestroy {

   private validForm: FormGroup;
   private urlSubscription: Subscription;
   private dataEmitter: EventEmitter<any> = new EventEmitter<any>();

   constructor(private beaconUtility: SigmaBeaconUtility, formBuilder: FormBuilder,
      private route: ActivatedRoute, private applicationService: SigmaApplicationService) {
      this.validForm = formBuilder.group({});

      this.urlSubscription = route.params.subscribe(params => {
         this.beaconUtility.mainComponent.busy = this.applicationService.getApplication(params['id']).subscribe(data => {
            if (data.code === 200) {
               this.dataEmitter.emit({
                  'data': JSON.parse(data.data)
               });
            }
         });
      });
   }

   public ngAfterViewInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': false,
         'value': 'Applications',
         'routes': ['applications', 'list']
      }, {
         'isLeaf': true,
         'value': this.route.snapshot.params.app_name.toUpperCase()
      }]);
   }

   public ngOnDestroy(): void {
      if (this.urlSubscription != null) {
         this.urlSubscription.unsubscribe();
      }
   }

}
