import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from '../environments/environment';
import { SigmaBeaconMainModule } from '../app/modules/main/sigma.beacon.main.module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(SigmaBeaconMainModule);
