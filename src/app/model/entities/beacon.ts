import { BeaconType } from './beacon.type.enum';
import { Entity } from './entity';
import { Floor } from './floor';
import { Zone } from './zone';

export class Beacon implements Entity {
   private _id: number;
   private _uuid: string;
   private _name: string;
   private _zone: Zone;
   private _floor: Floor;
   private _type: BeaconType;
   private _addedOn: Date;
   private _data: any;
   private _lat: number;
   private _lng: number;
   private _location: string;
   private _vendor: string;
   private _config: any;
   private _hasTrigger: boolean;

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get uuid(): string {
      return this._uuid;
   }

   public set uuid(value: string) {
      this._uuid = value;
   }

   public get name(): string {
      return this._name;
   }

   public set name(value: string) {
      this._name = value;
   }

   public get zone(): Zone {
      return this._zone;
   }

   public set zone(value: Zone) {
      this._zone = value;
   }

   public get floor(): Floor {
      return this._floor;
   }

   public set floor(value: Floor) {
      this._floor = value;
   }

   public get type(): BeaconType {
      return this._type;
   }

   public set type(value: BeaconType) {
      this._type = value;
   }

   public get data(): any {
      return this._data;
   }

   public set data(value: any) {
      this._data = value;
   }

   public get addedOn(): Date {
      return this._addedOn;
   }

   public set addedOn(value: Date) {
      this._addedOn = value;
   }

   public get lat(): number {
      return this._lat;
   }

   public set lat(value: number) {
      this._lat = value;
   }

   public get lng(): number {
      return this._lng;
   }

   public set lng(value: number) {
      this._lng = value;
   }

   public get location(): string {
      return this._location;
   }

   public set location(value: string) {
      this._location = value;
   }

   public get vendor(): string {
      return this._vendor;
   }

   public set vendor(value: string) {
      this._vendor = value;
   }

   public get config(): any {
      return this._config;
   }

   public set config(value: any) {
      this._config = value;
   }

   public get hasTrigger(): boolean {
      return this._hasTrigger;
   }

   public set hasTrigger(value: boolean) {
      this._hasTrigger = value;
   }


   public fromJson(beaconJsonData: any): void {
      const beaconJson = beaconJsonData.beacon !== undefined ? JSON.parse(beaconJsonData.beacon) : beaconJsonData;

      this.name = beaconJson.name;
      this.id = beaconJson.id;
      this.type = beaconJson.protocol;
      this.uuid = beaconJson.proximity_uuid;
      this.zone = new Zone();
      this.floor = new Floor();

      if (beaconJson.hasOwnProperty('parents')) {
         this.zone.fromJson(beaconJson.parents.zones[0]);
      } else if (beaconJsonData.hasOwnProperty('zone')) {
         this.zone.fromJson(JSON.parse(beaconJsonData.zone));
      } else {
         this.zone.name = 'Unassigned';
      }

      if (beaconJsonData.hasOwnProperty('beacon_config')) {
         this.config = JSON.parse(JSON.parse(beaconJsonData.beacon_config).data);
         this.config.last_action = new Date().fromSQLFormat(this.config.last_action);
      }

      this.floor.name = beaconJson.floor === null ? 'N/A' : beaconJson.floor;

      this.lat = beaconJson.lat;
      this.lng = beaconJson.lng;
      this.location = beaconJson.location;
      this.vendor = beaconJson.vendor;

      this.addedOn = new Date().fromSQLFormat(beaconJson.created_at);

      if (beaconJsonData.hasOwnProperty('proximity_fields')) {
         this.data = JSON.parse(beaconJsonData.proximity_fields);
      }
   }

   public toJson(): string {
      const beaconJson = {
         'name': this._name,
         'lat': this._lat,
         'lng': this._lng,
         'location': this._location,
         'protocol': this._type === BeaconType.IBEACON ? 'iBeacon' : 'Eddystone',
         'proximity_uuid': this._uuid,
         'vendor': this._vendor,
         'floor': this._floor.name,
         'proximity_fields': this._data,
         'beacon_config': this._config
      }

      if (this._id)
         beaconJson['id'] = this._id;
      if (this._zone)
         beaconJson['zone_id'] = this._zone.id;
      return JSON.stringify(beaconJson);
   }

}
