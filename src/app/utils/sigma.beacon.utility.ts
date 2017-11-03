import { Observable } from '@angular-cli/ast-tools/node_modules/rxjs/Rx';
import { EventEmitter, Injectable } from '@angular/core';
import { Response, URLSearchParams } from '@angular/http';
import { ToastOptions, ToastyConfig, ToastyService } from 'ng2-toasty';

import { GrowlType } from '../model/entities/growl.type.enum';
import { SigmaBeaconMainComponent } from '../view-controller/main/sigma.beacon.main.component';


@Injectable()
export class SigmaBeaconUtility {
   private _breadcrumbEmitter: EventEmitter<Array<any>> = new EventEmitter();
   private _mainComponent: SigmaBeaconMainComponent;

   constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
      this.toastyConfig.theme = 'material';
      this.toastyConfig.position = 'top-right';
   }

   public handleError(error: Response | any) {
      let errMsg: string;
      if (error instanceof Response) {
         const body = error.json() || '';
         const err = body.error || JSON.stringify(body);
         errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
         errMsg = error.error;
      }

      return Observable.throw(errMsg);
   }

   public get breadcrumbEmitter(): EventEmitter<Array<any>> {
      return this._breadcrumbEmitter;
   }

   public parseParamsToJson(params: URLSearchParams): string {
      const json = {};

      params.paramsMap.forEach((value: string[], key: string, map: any) => {
         if (value.length === 1) {
            json[key] = value[0];
         } else {
            json[key] = JSON.stringify(value);
         }
      });
      return JSON.stringify(json);
   }

   public showGrowlMessage(title: string, message: string, type: GrowlType): void {
      var toastOptions: ToastOptions = {
         title: title,
         msg: message,
         showClose: true,
         timeout: 5000,
         theme: 'bootstrap'
      };

      switch (type) {
         case GrowlType.INFO:
            this.toastyService.info(toastOptions);
            break;
         case GrowlType.SUCCESS:
            this.toastyService.success(toastOptions);
            break;
         case GrowlType.ERROR:
            this.toastyService.error(toastOptions);
            break;
         case GrowlType.WARNING:
            this.toastyService.warning(toastOptions);
            break;
         default:
            this.toastyService.wait(toastOptions);
      }

   }

   public setMainComponent(mainComponent: SigmaBeaconMainComponent): void {
      this._mainComponent = mainComponent;
   }

   public get mainComponent(): SigmaBeaconMainComponent {
      return this._mainComponent;
   }

}
