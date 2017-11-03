import { Beacon } from './beacon';
import { Entity } from './entity';

export class Zone implements Entity {
   private _id: number;
   private _name: string;
   private _color: string;
   private _description: string;
   private _beaconsCount: number = 0;
   private _beacons: Array<Beacon> = new Array<Beacon>();
   private _code: string;
   private _uniqueIdentifier: string;

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get name(): string {
      return this._name;
   }

   public set name(value: string) {
      this._name = value;
   }

   public get color(): string {
      return this._color;
   }

   public set color(value: string) {
      this._color = value;
   }

   public get description(): string {
      return this._description;
   }

   public set description(value: string) {
      this._description = value;
   }

   public get beacons(): Array<Beacon> {
      return this._beacons;
   }

   public set beacons(value: Array<Beacon>) {
      this._beacons = value;
   }

   public get beaconsCount(): number {
      return this._beaconsCount;
   }

   public set beaconsCount(value: number) {
      this._beaconsCount = value;
   }

   public get code(): string {
      if (!this._code)
         this._code = this._id + '-' + this._color;
      return this._code;
   }

   public set code(value: string) {
      this._code = value;
   }

   public get uniqueIdentifier(): string {
      if (!this._uniqueIdentifier)
         this._uniqueIdentifier = this._id + '-' + this._color + '-' + this._name;
      return this._uniqueIdentifier;
   }

   public set uniqueIdentifier(value: string) {
      this._uniqueIdentifier = value;
   }

   public addBeacon(beacon: Beacon): void {
      this._beacons.push(beacon);
      this._beaconsCount = this._beaconsCount + 1;
   }

   public removeBeacon(index: number): Beacon {
      this._beaconsCount = this._beaconsCount - 1;
      return this._beacons.splice(index, 1)[0];
   }


   public fromJson(json: any): void {
      const zoneJson = json.zone || json;
      const beaconsArray = json.beacons;

      this._name = zoneJson.name;
      this._color = zoneJson.color;
      this._id = zoneJson.id;
      this._description = zoneJson.description;
      this._beaconsCount = zoneJson.beacons_count;
      this._code = this._id + '-' + this._color;

      if (beaconsArray)
         for (const beaconJson of beaconsArray) {
            const beacon: Beacon = new Beacon();
            beacon.fromJson(beaconJson);
            beacon.zone = this;

            this.beacons.push(beacon);
         }
   }

   public toJson(): string {
      return JSON.stringify(this);
   }

   public getBeaconsIdArray(): string {
      const beaconsIdArray = [];
      for (const beacon of this.beacons) {
         const beaconId = {};
         beaconId['_id'] = beacon.id;

         beaconsIdArray.push(beaconId);
      }
      return JSON.stringify(beaconsIdArray);
   }
}

