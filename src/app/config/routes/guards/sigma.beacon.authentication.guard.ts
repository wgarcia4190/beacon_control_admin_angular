import { SigmaBeaconSessionManagement } from '../../../utils/sigma.beacon.session.management';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class SigmaBeaconAuthGuard implements CanActivate, CanActivateChild {
   constructor(private router: Router, private http: Http, private sessionManagement: SigmaBeaconSessionManagement) {

   }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      return this.sessionManagement.isUserLogged;
   }

   canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
      return this.sessionManagement.isUserLogged;
   }


}
