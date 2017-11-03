import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { Beacon } from '../../../../model/entities/beacon';
import { Floor } from '../../../../model/entities/floor';
import { Zone } from '../../../../model/entities/zone';
import { SigmaZoneService } from '../../../../model/services/sigma.zone.service';
import { SigmaBeaconUtility } from '../../../../utils/sigma.beacon.utility';

declare const jQuery: any;
declare const google: any;

@Component({
   selector: 'sigma-beacon-crud-basic-beacon',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.crud.basic.component.html',
   styleUrls: [
      '../../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../../assets/resources/css/sigma.beacon.tabs.scss',
      '../../../../../assets/resources/css/sigma.beacon.crud.scss'
   ]
})
export class SigmaBeaconCrudBasicComponent implements OnInit, AfterViewInit, OnDestroy {

   @ViewChild('beaconmap') private _beaconMapEl: ElementRef;
   @ViewChild('beaconlocation') private _beaconAddressEl: ElementRef;

   private map: any;
   private floors: Array<Floor> = [];
   private zones: Array<Zone> = [];
   private marker: any;

   private beaconLatSubscription: Subscription;
   private beaconLngSubscription: Subscription;

   private isEdit: boolean = false;

   @Input() private validForm: FormGroup;
   @Input() private beacon: Beacon;

   constructor(private zoneService: SigmaZoneService, private beaconUtility: SigmaBeaconUtility,
      router: ActivatedRoute) {
      this.isEdit = router.snapshot.data['editable'];
   }

   public ngOnInit(): void {
      this.getFloors();
      this.getZones();

      const mapProp = {
         zoom: 18,
         mapTypeControlOptions: { mapTypeIds: [] }
      };
      this.map = new google.maps.Map(this._beaconMapEl.nativeElement, mapProp);

      this.marker = new google.maps.Marker({
         map: this.map,
         icon: {
            url: './assets/resources/imgs/marker_move.png',
            scaledSize: new google.maps.Size(60, 60)
         },
         draggable: true
      });

      this.marker.addListener('dragend', (event) => {
         this.validForm.controls['beaconLat'].setValue(event.latLng.lat().toFixed(4), { emitEvent: false });
         this.validForm.controls['beaconLng'].setValue(event.latLng.lng().toFixed(4), { emitEvent: false });

         this.getReverseGeocodingData(event.latLng);
      });

      this.beaconLatSubscription = this.validForm.controls['beaconLat'].valueChanges.subscribe(data => {
         this.updateMapPosition(data, this.validForm.controls['beaconLng'].value);
      });
      this.beaconLngSubscription = this.validForm.controls['beaconLng'].valueChanges.subscribe(data => {
         this.updateMapPosition(this.validForm.controls['beaconLat'].value, data);
      });
   }

   public ngAfterViewInit(): void {
      if (!this.isEdit) {
         this.getLocation();
      }
   }

   private getLocation(): void {
      if (navigator.geolocation) {
         const self = this;
         navigator.geolocation.getCurrentPosition((response) => {
            self.showPosition(response, self);
         }, error => {
            console.log('Unable to get GPS Location');
         }, { enableHighAccuracy: true });

         return;
      }
      console.log('Geolocation is not supported by this browser.');
   }

   private showPosition(position: any, self: any): void {
      this.validForm.controls['beaconLat'].setValue(position.coords.latitude.toFixed(4), { emitEvent: false });
      this.validForm.controls['beaconLng'].setValue(position.coords.longitude.toFixed(4), { emitEvent: false });

      const myLatLng = new google.maps.LatLng(position.coords.latitude,
         position.coords.longitude);

      this.marker.setPosition(myLatLng);

      this.map.panTo(myLatLng);
      this.getReverseGeocodingData(myLatLng);
   }

   private onZoneChanged(event): void {
      const value = event.target.value.split('-');
      jQuery('.btn-group.bootstrap-select.select-with-border').css('border-color', value[1]);
   }

   private getFloors(): void {
      for (let index = 1; index < 6; index++) {
         const floor = new Floor();
         floor.name = index + '';

         this.floors.push(floor);
      }
   }
   private getZones(): void {
      this.beaconUtility.mainComponent.busy = this.zoneService.getZones().subscribe(zoneArray => {
         if (zoneArray.code === 200) {
            this.zones = JSON.parse(zoneArray.data);

            setTimeout(() => jQuery('.selectpicker').selectpicker(), 10);
         }
      });
   }

   private getReverseGeocodingData(latlng: any): void {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'latLng': latlng }, (results, status) => {
         if (status === google.maps.GeocoderStatus.OK) {
            this._beaconAddressEl.nativeElement.value = (results[0].formatted_address);
            this.validForm.controls['beaconLocation'].setValue((results[0].formatted_address));
         }
      });
   }

   private getRandomInt(min, max): number {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   private updateMapPosition(lat: any, lng: any): void {
      const latLng = new google.maps.LatLng(lat, lng);
      this.marker.setPosition(latLng);
      this.map.panTo(latLng);
      this.getReverseGeocodingData(latLng);
   }

   private validateForm(callback: () => void): void {

   }

   public ngOnDestroy(): void {
      if (this.beaconLatSubscription) {
         this.beaconLatSubscription.unsubscribe();
      }
      if (this.beaconLngSubscription) {
         this.beaconLngSubscription.unsubscribe();
      }
   }
}
