import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { Activity } from '../entities/activity';
import { Coupon } from '../entities/coupon';

@Injectable()
export class SigmaActivityService {

	constructor(private http: Http, private utility: SigmaBeaconUtility) { }

	public getActivityById(activityId: number): Observable<any> | any {
		return this.http.get('/activity/secure/get-activity/' + activityId).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public getCouponById(activityId: number): Observable<any> | any {
		return this.http.get('/activity/secure/get-coupon/' + activityId).map((res: Response) => {
			const body = res.json();
			if (body.code === 200) {
				return body || {};
			}
			throw Observable.throw(body);
		}).catch(this.utility.handleError);
	}

	public saveActivity(activity: Activity): Observable<any> | any {
		return this.http.put('/activity/secure/save-activity', activity.toJson())
			.map((res: Response) => {
				const body = res.json();
				if (body.code === 200) {
					return body || {};
				}
				throw Observable.throw(body);
			}).catch(this.utility.handleError);
	}

	public saveCoupon(coupon: Coupon): Observable<any> | any {
		return this.http.put('/activity/secure/save-coupon', coupon.toJson())
			.map((res: Response) => {
				const body = res.json();
				if (body.code === 200) {
					return body || {};
				}
				throw Observable.throw(body);
			}).catch(this.utility.handleError);
	}

	public deleteActivity(activityId: number): Observable<any> | any {
		return this.http.delete('/activity/secure/delete-activity/' + activityId)
			.map((res: Response) => {
				const body = res.json();
				if (body.code === 200) {
					return body || {};
				}
				throw Observable.throw(body);
			}).catch(this.utility.handleError);
	}
}