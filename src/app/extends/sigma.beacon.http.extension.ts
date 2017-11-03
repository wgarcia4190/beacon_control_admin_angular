import { SigmaBeaconSessionManagement } from '../utils/sigma.beacon.session.management';
import { AppConfig } from '../config/sigma.beacon.config';
import { Injectable } from '@angular/core';
import {
   ConnectionBackend,
   Headers,
   Http,
   Request,
   RequestOptions,
   RequestOptionsArgs,
   Response,
   URLSearchParams
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class SigmaBeaconHttpExtention extends Http {
   private contentType: string = 'application/json';

   constructor(backend: ConnectionBackend, defaultOptions: RequestOptions,
      private appConfig: AppConfig, private sessionManagement: SigmaBeaconSessionManagement) {
      super(backend, defaultOptions);
   }
   request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
      return super.request(url, options);
   }

   get(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return super.get(this.appConfig.getConfig()['apiServer'].concat(url), this.getRequestOptionArgs(options));
   }

   post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      this.contentType = 'application/x-www-form-urlencoded';
      return super.post(this.appConfig.getConfig()['apiServer'].concat(url), body, this.getRequestOptionArgs(options));
   }

   postWithoutBody(url: string, options?: RequestOptionsArgs): Observable<Response> {
      this.contentType = 'application/x-www-form-urlencoded';
      return super.post(this.appConfig.getConfig()['apiServer'].concat(url), '', this.getRequestOptionArgs(options));
   }

   put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      return super.put(this.appConfig.getConfig()['apiServer'].concat(url), body, this.getRequestOptionArgs(options));
   }

   patch(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
      return super.patch(this.appConfig.getConfig()['apiServer'].concat(url), body, this.getRequestOptionArgs(options));
   }

   delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
      return super.delete(this.appConfig.getConfig()['apiServer'].concat(url), this.getRequestOptionArgs(options));
   }

   private getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
      const params: URLSearchParams = new URLSearchParams();

      if (options == null) {
         options = new RequestOptions();
      }
      if (options.headers == null) {
         options.headers = new Headers();
      }
      options.headers.append('Content-Type', this.contentType);
      options.withCredentials = true;

      if (this.sessionManagement.user) {
         if (this.sessionManagement.isUserLogged) {
            options.headers.append('Authorization', 'Bearer '.concat(this.sessionManagement.user.token));
         } else {
            window.location.href = window.location.origin;
         }
      }

      return options;
   }
}
