import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Application } from '../entities/application';

@Injectable()
export class SigmaApplicationService {

	constructor(private http: Http, private utility: SigmaBeaconUtility) { }

	public getApplications(): Observable<any> | any {
		return this.http.get('/app/secure/get-applications').map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public getApplication(appId: number): Observable<any> | any {
		return this.http.get('/app/secure/get-application/' + appId).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public saveApplication(application: Application): Observable<any> | any {
		return this.http.put('/app/secure/save-application', application.toJson()).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public deleteApplication(applicationId: number): Observable<any> | any {
		return this.http.delete('/app/secure/delete-application/' + applicationId).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}
}
