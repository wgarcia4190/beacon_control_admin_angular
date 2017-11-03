import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { Application } from '../../../model/entities/application';
import { SigmaApplicationService } from '../../../model/services/sigma.application.service';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';

@Component({
   selector: 'sigma-beacon-application-list',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.application.list.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.application.list.scss'
   ]

})
export class SigmaBeaconApplicationListComponent implements OnInit, AfterViewInit {
   private apps: Array<Application> = [];
   @ViewChild('createApplicationContainer') private _createAppContainer: ElementRef;
   @ViewChild('addApplication') private _addAppContainer: ElementRef;
   @ViewChild('saveApplicationButton') private _addAppButton: ElementRef;

   constructor(private renderer: Renderer2,
      private beaconUtility: SigmaBeaconUtility, private applicationService: SigmaApplicationService,
      private route: Router) { }

   public ngOnInit(): void {
      this.applicationService.getApplications().subscribe(data => {
         if (data.code === 200) {
            this.apps = JSON.parse(data.data);
         }
      });
   }

   public ngAfterViewInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': true,
         'value': 'Applications'
      }]);
   }

   private toggleCreateAppForm(elementToFocus: HTMLInputElement): void {
      const createAppStyle = this._createAppContainer.nativeElement.style.display === 'none' ? 'block' : 'none';
      const appAppStyle = this._createAppContainer.nativeElement.style.display === 'none' ? 'none' : 'block';

      this.renderer.setStyle(this._createAppContainer.nativeElement, 'display', createAppStyle);
      this.renderer.setStyle(this._addAppContainer.nativeElement, 'display', appAppStyle);

      elementToFocus.focus();
   }

   private checkApplicationName(st: any): void {
      if (st.target.value === '') {
         this.renderer.setStyle(this._addAppButton.nativeElement, 'display', 'none');
      } else {
         this.renderer.setStyle(this._addAppButton.nativeElement, 'display', 'inline-block');
      }
   }

   private showApplication(appId: number, appName: string): void {
      this.route.navigate(['/app', 'applications', appId, appName, 'activities']);
   }

   private saveApplication(appName: string, elementToFocus: HTMLInputElement): void {
      const application: Application = new Application();
      application.name = appName;
      this.beaconUtility.mainComponent.busy = this.applicationService.saveApplication(application).subscribe(data => {
         if (data.code === 200) {
            application.id = +data.data;
            this.apps.push(application);
            this.toggleCreateAppForm(elementToFocus);
         } else {
            this.toggleCreateAppForm(elementToFocus);
         }
      });
   }

   private deleteApplication(appId: number): void {
      this.beaconUtility.mainComponent.busy = this.applicationService.deleteApplication(appId).subscribe(data => {
         if (data.code === 200) {
            let count: number = 0;
            for (; count < this.apps.length; count++) {
               if (this.apps[count].id === appId) {
                  break;
               }
               continue;
            }

            this.apps.splice(count, 1);
         }
      }, (error) => {
         console.log(error);
      });
   }
}
