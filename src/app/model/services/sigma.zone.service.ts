import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Zone } from '../entities/zone';


@Injectable()
export class SigmaZoneService {

   constructor(private http: Http, private utility: SigmaBeaconUtility) { }

   public getZones(): Observable<any> | any {
      return this.http.get('/zone/secure/getZones').map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public getZoneById(zoneId: string): Observable<any> | any {

      return this.http.get('/zone/secure/getZoneById?zone-id='.concat(zoneId)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public getBeaconsWithoutZone(): Observable<any> | any {
      return this.http.get('/beacon/secure/getBeaconsNoZone').map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public saveZone(zone: Zone, edit: boolean = false): Observable<any> | any {
      const params: URLSearchParams = new URLSearchParams();

      if (edit)
         params.set("id", zone.id.toString());
      params.set("name", zone.name);
      params.set("description", zone.description);
      params.set("color", zone.color);
      params.set("beacons_count", zone.beaconsCount.toString());
      params.set("beacons", zone.getBeaconsIdArray());

      return this.http.put('/zone/secure/save-zone', this.utility.parseParamsToJson(params)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public deleteZone(zoneId: number): Observable<any> | any {
      return this.http.delete('/zone/secure/delete-zone/'.concat(zoneId.toString())).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }
}