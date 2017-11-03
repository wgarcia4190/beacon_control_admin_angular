import { Component, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
   selector: 'sigma-beacon-crud-settings-beacon',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.crud.settings.component.html',
   styleUrls: [
      '../../../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../../../assets/resources/css/sigma.beacon.tabs.scss',
      '../../../../../assets/resources/css/sigma.beacon.crud.scss'
   ]
})
export class SigmaBeaconCrudSettingsComponent {

   @Input() private validForm: FormGroup;
   private beaconuuidMask = [/[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
      /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-',
      /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
      /[0-9A-Fa-f]/, '-', /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/,
      /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/, /[0-9A-Fa-f]/];

   constructor(private renderer: Renderer2) { }


   public toggleBeaconNotification(element: any, event: any) {
      const displayStyle = event.target.checked ? 'block' : 'none';

      this.renderer.setStyle(element, 'display', displayStyle);
   }

   public onSelectedProtocol(iBeaconContainer: any, eddyStoneContainer: any, event: any) {
      const value = event.target.value;
      let iBeaconDisplayStyle;
      let eddystoneDisplayStyle;
      const controls = this.validForm.controls;

      switch (value) {
         case 'Eddystone':
            iBeaconDisplayStyle = 'none';
            eddystoneDisplayStyle = 'block';

            controls['beaconUUID'].disable();
            controls['beaconMajor'].disable();
            controls['beaconMinor'].disable();

            controls['beaconNamespace'].enable();
            controls['beaconInstance'].enable();
            controls['beaconInterval'].enable();

            break;
         default:
            iBeaconDisplayStyle = 'block';
            eddystoneDisplayStyle = 'none';

            controls['beaconUUID'].enable();
            controls['beaconMajor'].enable();
            controls['beaconMinor'].enable();

            controls['beaconNamespace'].disable();
            controls['beaconInstance'].disable();
            controls['beaconInterval'].disable();
            break;
      }
      this.renderer.setStyle(iBeaconContainer, 'display', iBeaconDisplayStyle);
      this.renderer.setStyle(eddyStoneContainer, 'display', eddystoneDisplayStyle);
   }

   private toggleCheckbox(checkbox: any) {
      checkbox.checked = !checkbox.checked;
      console.log(checkbox.checked);
   }
}
