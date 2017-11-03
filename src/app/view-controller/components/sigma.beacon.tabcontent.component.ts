import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
   selector: 'sigma-beacon-tabcontent',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.tabcontent.component.html',
   styleUrls: [
      '../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../assets/resources/css/sigma.beacon.tabs.scss'
   ]
})

export class SigmaBeaconTabContentComponent {
   @Input() private tabId: string;
   @Input() private displayStyle: string;
}
