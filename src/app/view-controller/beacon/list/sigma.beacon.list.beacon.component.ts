import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DialogService } from 'ng2-bootstrap-modal';
import { Subscription } from 'rxjs/Rx';

import { Beacon } from '../../../model/entities/beacon';
import { Floor } from '../../../model/entities/floor';
import { Zone } from '../../../model/entities/zone';
import { SigmaBeaconService } from '../../../model/services/sigma.beacon.service';
import { SigmaZoneService } from '../../../model/services/sigma.zone.service';
import { SortPipe } from '../../../utils/pipes/sigma.sort.pipe';
import { SigmaBeaconUtility } from '../../../utils/sigma.beacon.utility';
import { SigmaBeaconModalDialogComponent } from '../../components/sigma.beacon.modal.dialog.component';

declare const jQuery: any;

@Component({
   selector: 'sigma-beacon-list',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.list.beacon.component.html',
   styleUrls: [
      '../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../assets/resources/css/sigma.beacon.list.scss'
   ]
})
export class SigmaBeaconListBeaconComponent implements OnInit, AfterViewInit, OnDestroy {

   private showBulkAction: boolean;

   private zones: Array<Zone> = [];
   private floors: Array<Floor> = [];
   private beacons: Array<Beacon> = [];
   private selectedBeaconsMap: any = {};

   private selectedBeacons: Array<number> = [];
   private allCheckboxController: FormControl = new FormControl();
   private checkboxSubscription: Subscription;

   constructor(private beaconUtility: SigmaBeaconUtility, private renderer: Renderer2,
      private sortPipe: SortPipe, private dialogService: DialogService,
      private beaconService: SigmaBeaconService, private zoneService: SigmaZoneService) {

      this.checkboxSubscription = this.allCheckboxController.valueChanges.subscribe((value) => {
         this.showBulkAction = value;
         for (const beaconId in this.selectedBeaconsMap) {
            if (this.selectedBeaconsMap.hasOwnProperty(beaconId)) {
               this.selectedBeaconsMap[beaconId] = value;
               if (value) {
                  if (this.selectedBeacons.indexOf(+beaconId) === -1) {
                     this.selectedBeacons.push(+beaconId);
                  }
               } else {
                  this.selectedBeacons = [];
               }
            }
         }
      });
   }

   public ngOnInit(): void {
      this.getBeacons();
      this.getZones();
   }

   public ngAfterViewInit(): void {
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': true,
         'value': 'Beacons'
      }]);
      jQuery('.selectpicker').selectpicker();
   }

   private toggleBulkActions(beaconId, event): void {
      this.selectedBeaconsMap[beaconId] = event.target.checked;
      if (!event.target.checked) {

         const index = this.selectedBeacons.indexOf(beaconId);
         this.selectedBeacons.splice(index, 1);
         this.showBulkAction = this.selectedBeacons.length > 0;
         if (!this.showBulkAction) {
            this.allCheckboxController.setValue(false, { emitEvent: false });
         }
      } else {
         this.selectedBeacons.push(beaconId);
         this.showBulkAction = true;
      }
   }

   private onSortTable(column: string, event: any, innerProperty: string = undefined) {
      const classList = event.target.classList;
      const order = classList.contains('asc') ? 'desc' : 'asc';
      event.target.className = '';

      jQuery('.current').removeClass();

      classList.add('current');
      classList.add(order);
      this.beacons = this.sortPipe.transform(this.beacons, { key: column, order: order, innerProperty: innerProperty });
   }

   private onShowDeleteModal(bulkAction: boolean, beaconId: number): void {
      let disposable = this.dialogService.addDialog(SigmaBeaconModalDialogComponent, {
         title: 'Warning!',
         message: 'Are you sure you want to delete beacon?',
         bottonText: 'Delete',
         bottonClass: 'btn btn-danger btn-action-delete btn-static-width with-modal'
      }).subscribe((isConfirmed) => {
         if (isConfirmed) {
            if (bulkAction === false) {
               this.deleteBeacon(beaconId);
            } else {
               this.deleteBeacons();
            }
         }
      });
   }

   private getZones(): void {
      const zones: Array<Zone> = [];

      this.zoneService.getZones().subscribe(data => {
         if (data.code === 200) {
            const zoneArray = JSON.parse(data.data);

            zoneArray.forEach((zone: any) => {
               const newZone: Zone = new Zone();
               newZone.fromJson(zone);
               zones.push(newZone);
            });

            this.zones = [].concat(zones);
         }
      });
   }


   private getBeacons(): void {
      const beacons: Array<Beacon> = [];

      this.beaconUtility.mainComponent.busy = this.beaconService.getBeacons().subscribe(data => {
         if (data.code === 200) {
            const beaconArray = JSON.parse(data.data);

            beaconArray.forEach((beacon: any) => {
               const newBeacon: Beacon = new Beacon();
               newBeacon.fromJson(beacon);
               beacons.push(newBeacon);

               this.selectedBeaconsMap[newBeacon.id] = false;
            });

            this.beacons = [].concat(beacons);
         }
      });
   }

   private deleteBeacon(beaconId: number): void {
      this.beaconUtility.mainComponent.busy = this.beaconService.deleteBeacon(beaconId).subscribe(data => {
         if (data.code === 200) {
            let tempBeaconsArray = [];
            this.beacons.forEach(beacon => {
               if (beacon.id !== beaconId) {
                  tempBeaconsArray.push(beacon);
               }
            });

            this.beacons = tempBeaconsArray;
            tempBeaconsArray = undefined;
         }
      });
   }

   private deleteBeacons(): void {
      let beaconsIdList: string = "";
      this.selectedBeacons.forEach(beaconId => {
         beaconsIdList += beaconId + ", ";
      });

      beaconsIdList = beaconsIdList.substring(0, beaconsIdList.length - 2);

      this.beaconUtility.mainComponent.busy = this.beaconService.deleteBeacons(beaconsIdList).subscribe(data => {
         if (data.code === 200) {
            let tempBeaconsArray = [].concat(this.beacons);
            this.selectedBeacons.forEach(beaconId => {
               this.beacons.forEach(beacon => {
                  if (beacon.id === beaconId) {
                     const index = tempBeaconsArray.indexOf(beacon);
                     tempBeaconsArray.splice(index, 1);
                  }
               });
            });

            this.selectedBeacons = [];
            this.beacons = tempBeaconsArray;
            tempBeaconsArray = undefined;

            this.allCheckboxController.setValue(false, { emitEvent: false });
            this.showBulkAction = false;
         }
      });
   }

   public ngOnDestroy(): void {
      if (this.checkboxSubscription) {
         this.checkboxSubscription.unsubscribe();
      }
   }
}
