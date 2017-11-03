import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Beacon } from '../entities/beacon';


@Injectable()
export class SigmaBeaconService {

   constructor(private http: Http, private utility: SigmaBeaconUtility) { }

   public getBeacons(): Observable<any> | any {
      return this.http.get('/beacon/secure/getBeacons').map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public getBeaconById(beaconId: string): Observable<any> | any {
      return this.http.get('/beacon/secure/get-beacon-by-id?beacon-id='.concat(beaconId)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public saveBeacon(beacon: Beacon): Observable<any> | any {
      return this.http.put('/beacon/secure/save-beacon', beacon.toJson()).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public deleteBeacon(beaconId: number): Observable<any> | any {
      return this.http.delete('/beacon/secure/delete-beacon/'
         .concat(beaconId.toString())).map((res: Response) => {
            const body = res.json();
            if (body.code === 200) {
               return body || {};
            }
            throw Observable.throw(body);
         }).catch(this.utility.handleError);
   }

   public deleteBeacons(beaconsId: string): Observable<any> | any {
      const params: URLSearchParams = new URLSearchParams();
      params.set("beacons_ids", beaconsId);

      return this.http.post('/beacon/secure/delete-beacons-batch', this.utility.parseParamsToJson(params)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }
}
