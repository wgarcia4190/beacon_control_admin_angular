import { Component } from '@angular/core';
import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';

export interface ConfirmModel {
	title: string;
	message: string;
	bottonClass: string;
	bottonText: string;
}

@Component({
	selector: 'confirm',
	template: `<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
						  <button type="button" class="close" (click)="close()" >&times;</button>
						  <h4 class="modal-title">{{title || 'Confirm'}}</h4>
						</div>
						<div class="modal-body">
						  <p>{{message || 'Are you sure?'}}</p>
						</div>
						<div class="modal-footer">
						  <button type="button" class="btn-default btn btn-action-cancel btn-static-width" (click)="close()" >Cancel</button>
						  <button type="button" class="{{bottonClass}}" (click)="confirm()">{{bottonText}}</button>
						</div>
					 </div>
				 </div>`
})
export class SigmaBeaconModalDialogComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
	title: string;
	message: string;
	bottonClass: string;
	bottonText: string;
	constructor(dialogService: DialogService) {
		super(dialogService);

	}
	confirm() {
		this.result = true;
		this.close();
	}
}