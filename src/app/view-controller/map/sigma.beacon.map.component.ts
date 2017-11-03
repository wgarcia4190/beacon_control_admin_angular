import {
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   ElementRef,
   OnInit,
   ViewChild,
   ViewEncapsulation,
} from '@angular/core';
import { DialogService } from 'ng2-bootstrap-modal';

import { Beacon } from '../../model/entities/beacon';
import { Floor } from '../../model/entities/floor';
import { Zone } from '../../model/entities/zone';
import { SigmaBeaconService } from '../../model/services/sigma.beacon.service';
import { SigmaMapService } from '../../model/services/sigma.map.service';
import { SigmaZoneService } from '../../model/services/sigma.zone.service';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { SigmaBeaconModalDialogComponent } from '../components/sigma.beacon.modal.dialog.component';

declare const jQuery: any;
declare const google: any;
declare const fontawesome: any;

@Component({
   selector: 'sigma-beacon-map',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.map.component.html',
   styleUrls: [
      '../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../assets/resources/css/sigma.beacon.map.scss'
   ]
})
export class SigmaBeaconMapComponent implements OnInit, AfterViewInit {

   @ViewChild('mapContainer') private _beaconMapEl: ElementRef;

   private map: any;
   private beacon: Beacon;
   private floors: Array<Floor> = new Array<Floor>();
   private zones: Array<Zone> = new Array<Zone>();
   private zoneList: Array<Zone> = new Array<Zone>();
   private mapData: any = {};

   constructor(private beaconUtility: SigmaBeaconUtility, private mapService: SigmaMapService,
      private changeDetector: ChangeDetectorRef, private dialogService: DialogService,
      private beaconService: SigmaBeaconService, private zoneService: SigmaZoneService) {

      this.loadData();
   }

   public ngOnInit(): void {
      this.getFloors();
      this.map = new google.maps.Map(this._beaconMapEl.nativeElement, {
         zoom: 18,
         mapTypeControlOptions: { mapTypeIds: [] }
      });

      const myLatLng = new google.maps.LatLng(18.7, -69.8);
      this.map.panTo(myLatLng);

      this.zoneService.getZones().subscribe(zoneArray => {
         if (zoneArray.code === 200) {
            this.zoneList = JSON.parse(zoneArray.data);
         }
      });
   }

   public ngAfterViewInit(): void {
      jQuery('.selectpicker').selectpicker();
      this.beaconUtility.breadcrumbEmitter.emit([{
         'isLeaf': true,
         'value': 'Map'
      }]);
   }

   private loadData(): void {
      this.zones = new Array<Zone>();
      this.beaconUtility.mainComponent.busy = this.mapService.getZonesByBeacon().subscribe(data => {
         if (data.code === 200) {
            const zoneBeaconsJson = JSON.parse(data.data);
            for (const zoneJson in zoneBeaconsJson) {
               const zone: Zone = new Zone();
               zone.name = zoneJson.split('-')[0];
               zone.color = zoneJson.split('-')[1];
               zone.id = +zoneJson.split('-')[2];

               const zoneBeacons = zoneBeaconsJson[zoneJson];
               for (const zoneBeacon of zoneBeacons) {
                  const beacon: Beacon = new Beacon();
                  beacon.fromJson(JSON.parse(zoneBeacon));
                  beacon.zone = zone;

                  zone.beacons.push(beacon);
               }
               this.zones.push(zone);
            }
         }

         setTimeout(() => {
            jQuery('.bootstrap-switch').bootstrapSwitch({
               'size': 'small',
               'animate': true
            });

            jQuery('.selectpicker').selectpicker('refresh');

            const self = this;
            jQuery('.bootstrap-switch').on('switchChange.bootstrapSwitch', function (event, state) {
               const zoneName = jQuery(this).data('zonename');
               self.toggleZoneLayer(zoneName, state);
            });

            this.loadMapData();
         }, 10);
      });
   }

   private loadMapData(): void {
      const bounds = new google.maps.LatLngBounds();
      for (const zone of this.zones) {
         this.mapData[zone.name] = [];
         for (const beacon of zone.beacons) {
            let marker = new google.maps.Marker({
               position: new google.maps.LatLng(beacon.lat, beacon.lng),
               icon: {
                  path: fontawesome.markers.MAP_MARKER,
                  scale: 0.6,
                  strokeWeight: 0.2,
                  strokeColor: zone.color,
                  strokeOpacity: 1,
                  fillColor: zone.color,
                  fillOpacity: 0.7
               },
               map: this.map
            });

            marker.beacon = beacon;
            this.mapData[zone.name].push(marker);
            bounds.extend(marker.position);

            google.maps.event.addListener(marker, 'click', () => {
               this.beacon = marker.beacon;
               this.changeDetector.detectChanges();

               setTimeout(() => {
                  jQuery('.selectpicker').selectpicker('refresh');
                  jQuery('.btn-group.bootstrap-select.select-with-border').css('border-color', this.beacon.zone.color);
               }, 50);
            });
         }
      }
      this.map.fitBounds(bounds);
   }

   private toggleZoneLayer(zoneName: string, state: boolean): void {
      const markers = this.mapData[zoneName];
      if (markers) {
         for (const marker of markers) {
            marker.setVisible(state);
         }
      }
   }

   private getFloors(): void {
      for (let index = 1; index < 6; index++) {
         const floor = new Floor();
         floor.name = index + '';

         this.floors.push(floor);
      }
   }

   private filterByFloor(floorName: string): void {
      for (const zoneName in this.mapData) {
         const markers = this.mapData[zoneName];
         if (markers) {
            for (const marker of markers) {
               const state = floorName === 'all' || floorName == marker.beacon.floor.name ? true : false;
               marker.setVisible(state);
            }
         }
      }
   }

   private onShowDeleteModal(): void {
      this.dialogService.addDialog(SigmaBeaconModalDialogComponent).subscribe((isConfirmed) => {
         if (isConfirmed) {
            this.deleteBeacon();
         }
      });
   }

   private deleteBeacon(): void {
      this.beaconUtility.mainComponent.busy = this.beaconService.deleteBeacon(this.beacon.id).subscribe(data => {
         if (data.code === 200) {
            for (const zoneName in this.mapData) {
               const markers = this.mapData[zoneName];
               if (markers) {
                  for (let index = 0; index < markers.length; index++) {
                     if (markers[index].beacon.id === this.beacon.id) {
                        markers[index].setMap(null);
                        markers.splice(index, 1);

                        this.beacon = undefined;
                        this.changeDetector.detectChanges();
                        break;
                     }
                  }
               }
            }
         }
      });
   }

   private clearMap(): void {
      for (const zoneName in this.mapData) {
         const markers = this.mapData[zoneName];
         if (markers) {
            for (let index = 0; index < markers.length; index++) {
               markers[index].setMap(null);
            }
         }
      }
   }

   private updateZone(event): void {
      const value = event.target.value.split('-');
      jQuery('.btn-group.bootstrap-select.select-with-border').css('border-color', value[1]);

      this.beacon.zone.id = +value[0];
      this.beacon.zone.color = value[1];
      this.beacon.zone.name = value[2];

      this.mapService.updateBeacon(this.beacon).subscribe(data => {
         if (data.code === 200) {
            this.clearMap();
            this.loadData();
            this.changeDetector.detectChanges();
         }
      });
   }

   private updateFloor(event): void {
      const value = event.target.value;
      this.beacon.floor.name = value;

      this.mapService.updateBeacon(this.beacon).subscribe(data => {
         if (data.code === 200) {
            for (const zoneName in this.mapData) {
               const markers = this.mapData[zoneName];
               if (markers) {
                  for (let index = 0; index < markers.length; index++) {
                     if (markers[index].beacon.id === this.beacon.id) {
                        markers[index].beacon = this.beacon;
                        this.changeDetector.detectChanges();
                        break;
                     }
                  }
               }
            }
         }
      });
   }

}
