import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

import { SigmaBeaconUtility } from '../../utils/sigma.beacon.utility';

@Component({
  selector: 'sigma-beacon-root',
  encapsulation: ViewEncapsulation.None,
  template: `<ng2-toasty></ng2-toasty><div [ngBusy]="{busy: _busy, message: 'Loading...'}"></div><router-outlet></router-outlet>`
})
export class SigmaBeaconMainComponent {
  private _busy: Subscription;

  constructor(private beaconUtility: SigmaBeaconUtility) {
    this.beaconUtility.setMainComponent(this);
  }

  public set busy(value: Subscription) {
    this._busy = value;
  }
}
