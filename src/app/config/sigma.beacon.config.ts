import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class AppConfig {
   private config: any = {
      apiServer: environment.server
   };

   getConfig(): Object {
      return this.config;
   }
}
