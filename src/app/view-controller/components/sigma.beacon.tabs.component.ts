import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare const jQuery: any;

@Component({
   selector: 'sigma-beacon-tabs',
   encapsulation: ViewEncapsulation.None,
   templateUrl: './sigma.beacon.tabs.component.html',
   styleUrls: [
      '../../../assets/resources/css/sigma.beacon.general.scss',
      '../../../assets/resources/css/sigma.beacon.tabs.scss'
   ]

})
export class SigmaBeaconTabsComponent {
   @Input() private tabs: Array<string> = [];
   @Input() private cancelRoute?: Array<string> = [];
   @Input() private footerButtons?: Array<any> = [];
   @Input() private validatorsPerTab?: any;
   @Input() private validFormGroup?: FormGroup;
   @Input() private currentTab: string;
   @Input() private hasFooter: boolean = true;


   private switchTab(tabId: string, event: any, parent: any) {
      const isLastTab = this.tabs.indexOf(tabId) === this.tabs.length - 1;

      if (this.validatorsPerTab) {
         const validators = this.validatorsPerTab[this.currentTab];
         let hasErrors: boolean = false;

         for (const validator of validators) {
            const selector = `.${validator}.required`;
            const validatorObject = this.validFormGroup.controls[validator];

            if (validatorObject.enabled && !validatorObject.valid) {
               jQuery(selector).addClass('has-error');
               hasErrors = true;
            } else {
               jQuery(selector).removeClass('has-error');
            }
         }

         if (hasErrors) {
            return;
         }
      }

      const tabToHide: string = jQuery('a.tab-switcher.active').attr('target');
      const element = event.target;
      const tabToShow = element.attributes.target.nodeValue;

      jQuery('.tab-switcher.active').removeClass('active');
      jQuery(tabToHide).hide();
      jQuery(tabToShow).show();

      this.currentTab = tabToShow.replace('#', '');

      parent.classList.add('active');
      element.classList.add('active');

      if (isLastTab) {
         jQuery('#nextTab').css('display', 'none');
         jQuery('#endTab').css('display', 'inline-block');
      } else {
         jQuery('#nextTab').css('display', 'inline-block');
         jQuery('#endTab').css('display', 'none');
      }

   }
}
