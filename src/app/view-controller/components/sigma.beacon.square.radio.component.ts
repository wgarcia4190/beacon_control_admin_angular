import { Component, EventEmitter, Input, ViewEncapsulation } from '@angular/core';

declare const jQuery: any;

@Component({
	selector: 'sigma-beacon-square-radio',
	encapsulation: ViewEncapsulation.None,
	templateUrl: './sigma.beacon.square.radio.component.html',
	styleUrls: [
		'../../../assets/resources/css/sigma.beacon.general.scss'
	]
})

export class SigmaBeaconSquareRadioComponent {

	@Input() private name: string;
	@Input() private value: string;
	@Input() private radioName: string;
	@Input() private radioDescription = '';
	@Input() private active: boolean;

	@Input() private elementToShow?: string;
	@Input() private elementToHide?: string;

	private _notifyParent: EventEmitter<any> = new EventEmitter();

	private toggleActive(event: any): void {
		this._notifyParent.emit(this);
		jQuery('.field-triggered-dwell_time').css('display', 'none');
		const cssClassName = `.${this.name}.active`;
		jQuery(cssClassName).removeClass('active');

		jQuery(event.target).closest('label').addClass('active');

		if (this.elementToShow || this.elementToHide) {
			jQuery(this.elementToShow).css('display', 'block');
			jQuery(this.elementToHide).css('display', 'none');
		}
		event.stopPropagation();
	}

	private turnOffActivation(event: any) {
		console.log('aaaaaaa');
	}


	public get $active(): boolean {
		return this.active;
	}

	public set $active(value: boolean) {
		this.active = value;
	}

	public get notifyParent(): EventEmitter<any> {
		return this._notifyParent;
	}


	public get $value(): string {
		return this.value;
	}
}