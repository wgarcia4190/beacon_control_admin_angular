import { AfterContentInit, Component, ContentChildren, QueryList, ViewEncapsulation } from '@angular/core';

import { SigmaBeaconSquareRadioComponent } from './sigma.beacon.square.radio.component';

@Component({
	selector: 'sigma-beacon-square-radio-content',
	encapsulation: ViewEncapsulation.None,
	template: '<ng-content></ng-content>'
})
export class SigmaBeaconSquareRadioContentComponent implements AfterContentInit {
	@ContentChildren(SigmaBeaconSquareRadioComponent) private _squareRadios: QueryList<SigmaBeaconSquareRadioComponent>

	public get squareRadios(): QueryList<SigmaBeaconSquareRadioComponent> {
		return this._squareRadios;
	}

	public ngAfterContentInit(): void {
		this._squareRadios.forEach(cp => cp.notifyParent.subscribe((data: SigmaBeaconSquareRadioComponent) => {
			this.squareRadios.filter(cp => cp.$active)[0].$active = false;
			data.$active = true;
		}));
	}

	public getSelected(): SigmaBeaconSquareRadioComponent {
		return this.squareRadios.filter(cp => cp.$active)[0]
	}

	public setSelected(value: string): void {
		this.squareRadios.filter(cp => cp.$active)[0].$active = false;
		this.squareRadios.some(cp => {
			if (cp.$value == value) {
				cp.$active = true;
				return true;
			}
			return false;
		})
	}
}