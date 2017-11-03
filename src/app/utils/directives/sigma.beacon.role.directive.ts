import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
   selector: '[allowedRoles]'
})
export class SigmaBeaconRolesDirective {

   constructor(private templateRef: TemplateRef<any>,
      private vcRef: ViewContainerRef) {

   }

   @Input()
   set allowedRoles(allowedRoles: Array<string>) {
      let shouldBeRender = false;
      if (allowedRoles) {

      }

      if (shouldBeRender) {
         this.vcRef.createEmbeddedView(this.templateRef);
      } else {
         this.vcRef.clear();
      }
   }
}
