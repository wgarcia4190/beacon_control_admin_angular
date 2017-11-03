import { SigmaBeaconSessionManagement } from '../utils/sigma.beacon.session.management';
import { AppConfig } from '../config/sigma.beacon.config';
import { SigmaBeaconHttpExtention } from './sigma.beacon.http.extension';
import { RequestOptions, XHRBackend } from '@angular/http';

export function SigmaBeaconHttpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions,
   appConfig: AppConfig, sessionManagement: SigmaBeaconSessionManagement) {

   return new SigmaBeaconHttpExtention(xhrBackend, requestOptions, appConfig, sessionManagement);
}
