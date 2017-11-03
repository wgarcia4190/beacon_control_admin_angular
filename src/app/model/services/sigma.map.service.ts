import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Beacon } from '../entities/beacon';


@Injectable()
export class SigmaMapService {

	constructor(private http: Http, private utility: SigmaBeaconUtility) { }

	public getZonesByBeacon(): Observable<any> | any {
		return this.http.get('/map/secure/get-beacons-by-zone').map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public updateBeacon(beacon: Beacon): Observable<any> | any {
		return this.http.post('/map/secure/update-beacon', beacon.toJson()).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);

	}
}