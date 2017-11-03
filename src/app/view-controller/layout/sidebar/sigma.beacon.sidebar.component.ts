import { Location } from '@angular/common';
import { Router, UrlSerializer, UrlTree } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
   selector: '[sigma-beacon-sidebar]',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.sidebar.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.sidebar.scss'
   ]
})
export class SigmaBeaconSidebarComponent implements OnInit {

   private selectedRoute: string;

   constructor(private router: Router, private urlSerializer: UrlSerializer, private location: Location) { }

   public ngOnInit(): void {
      const urlTree: UrlTree = this.urlSerializer.parse(this.location.path());
      const segments = urlTree.root.children['primary'].segments;

      this.selectedRoute = segments[1].path;
   }

   public navigate(route: string): void {
      const fullRoute: string = '/app/'.concat(route);
      this.selectedRoute = route;
      this.router.navigate([fullRoute]);
   }
}
