import { Zone } from '../../../model/entities/zone';
import { SigmaZoneService } from '../../../model/services/sigma.zone.service';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';
import { SigmaBeaconModalDialogComponent } from '../../components/sigma.beacon.modal.dialog.component';
import { DialogService } from "ng2-bootstrap-modal";
import { AfterViewInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
   selector: 'sigma-beacon-zone-list',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.zone.list.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.zone.list.scss'
   ]

})
export class SigmaBeaconZoneListComponent implements OnInit, AfterViewInit {
   private zones: Array<Zone> = [];

   constructor(private beaconUtility: SigmaBeaconUtility, private zoneService: SigmaZoneService,
      private dialogService: DialogService, private route: Router) { }

   public ngOnInit(): void {
      this.zoneService.getZones().subscribe(zoneArray => {
         if (zoneArray.code === 200) {
            this.zones = JSON.parse(zoneArray.data);
         }
      });
   }

   public ngAfterViewInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': true,
         'value': 'Zones'
      }]);
   }

   private deleteZone(zoneId: number): void {
      let disposable = this.dialogService.addDialog(SigmaBeaconModalDialogComponent, {
         title: 'Warning!',
         message: 'Are you sure you want to delete zone?',
         bottonText: 'Delete',
         bottonClass: 'btn btn-danger btn-action-delete btn-static-width with-modal'
      }).subscribe((isConfirmed) => {
         if (isConfirmed) {
            this.zoneService.deleteZone(zoneId).subscribe(data => {
               if (data.code === 200) {
                  let count = 0;
                  for (; count < this.zones.length; count++) {
                     if (this.zones[count].id == zoneId) {
                        break;
                     }
                     continue;
                  }

                  this.zones.splice(count, 1);
               }
            }, (error) => {
               console.log(error);
            });
         }
      });
   }
}
