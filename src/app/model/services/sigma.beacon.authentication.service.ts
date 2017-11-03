import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { SigmaBeaconSessionManagement } from '../../utils/sigma.beacon.session.management';
import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';
import { User } from '../entities/user';

@Injectable()
export class SigmaBeaconAuthService {
   private user: User = new User();

   constructor(private http: Http, private utility: SigmaBeaconUtility,
      private sessionManagement: SigmaBeaconSessionManagement) { }

   public login(username: string, password: string): Observable<any> | any {
      const params = new URLSearchParams();
      params.append('email', username);
      params.append('password', password);

      return this.http.post('/user/login', params.toString(), {
         withCredentials: true
      }).map((res: Response) => {
         const token = res.headers.get('x-api-token');
         const body = res.json();

         if (body.code === 200) {
            body.data = JSON.parse(body.data);

            this.user.token = token;
            this.user.fromJSON(body.data.user);
            this.user.applicationId = body.data.application_id;

            this.sessionManagement.user = this.user;
            return body || {};
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public register(username: string): Observable<any> {
      const params = new URLSearchParams();
      params.append('email', username);

      return this.http.post('/user/signin', params.toString()).map((res: Response) => {
         const body = res.json();
         return body;
      }).catch(this.utility.handleError);
   }

   public confirmUser(confirmationToken: string): Observable<any> | any {
      const params = new URLSearchParams();
      params.set("confirmation_token", confirmationToken);

      return this.http.post('/user/confirm', this.utility.parseParamsToJson(params)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {}
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }

   public setPassword(confirmationToken: string, securityToken: string, password: string): Observable<any> | any {
      const params = new URLSearchParams();
      params.set("confirmation_token", confirmationToken);
      params.set("security_token", securityToken);
      params.set("password", password);

      return this.http.post('/user/password', this.utility.parseParamsToJson(params)).map((res: Response) => {
         const body = res.json();
         if (body.code === 200) {
            return body || {}
         }
         throw Observable.throw(body);
      }).catch(this.utility.handleError);
   }
}

