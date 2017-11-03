import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SigmaBeaconProfileService {

	constructor(private http: Http, private utility: SigmaBeaconUtility) { }

	public updateUser(properties: any): Observable<any> | any {
		const params = new URLSearchParams();

		for (var property in properties) {
			if (properties.hasOwnProperty(property)) {
				params.append(property, properties[property]);
			}
		}

		return this.http.patch('/user/secure/update', this.utility.parseParamsToJson(params)).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}
}

