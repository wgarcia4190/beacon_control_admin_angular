import { SigmaBeaconSessionManagement } from '../../../utils/sigma.beacon.session.management';
import { AfterViewInit } from '@angular/core/core';
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { Subscription } from 'rxjs/Rx';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
   selector: '[sigma-beacon-header]',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.header.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.header.scss'
   ]
})
export class SigmaBeaconHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
   private breadcrumbs: Array<any>;
   private breadcrumbSubscription: Subscription;
   private username: string;

   constructor(private beaconUtility: SigmaBeaconUtility, private router: Router,
      private sigmaBeaconSessionManagement: SigmaBeaconSessionManagement) { }

   public ngOnInit(): void {
      this.breadcrumbSubscription = this.beaconUtility.breadcrumbEmitter.subscribe(data => {
         this.breadcrumbs = data;
      });
   }

   public ngOnDestroy(): void {
      if (this.breadcrumbSubscription) {
         this.breadcrumbSubscription.unsubscribe();
      }
   }

   public ngAfterViewInit(): void {
      this.username = this.sigmaBeaconSessionManagement.user.email;
   }

   public logout(): void {
      localStorage.setItem('current_user', undefined);
      this.router.navigate(['/login']);

   }
}
