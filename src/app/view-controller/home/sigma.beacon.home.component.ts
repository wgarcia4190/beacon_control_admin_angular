import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
@Component({
   selector: 'sigma-beacon-home',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.home.component.html',
   styleUrls: [
      '../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../assets/resources/css/sigma.beacon.home.scss'
   ]
})
export class SigmaBeaconHomeComponent implements OnInit {

   constructor(private beaconUtility: SigmaBeaconUtility) { }

   public ngOnInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': true,
         'value': 'Home'
      }]);
   }
}
