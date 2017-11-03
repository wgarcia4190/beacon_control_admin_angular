import { Coupon } from './coupon';
import { Entity } from './entity';
import { Trigger } from './trigger';

export class Activity implements Entity {
   private _id: number;
   private _name: string;
   private _payload: string;
   private _scheme: string;
   private _customAttributes: Array<any> = new Array<any>();
   private _trigger: Trigger = new Trigger();
   private _coupon: Coupon = new Coupon();

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get name(): string {
      return this._name;
   }

   public set name(value: string) {
      this._name = value;
   }

   public get payload(): string {
      return this._payload;
   }

   public set payload(value: string) {
      this._payload = value;
   }

   public get scheme(): string {
      return this._scheme;
   }

   public set scheme(value: string) {
      this._scheme = value;
   }

   public get customAttributes(): Array<any> {
      return this._customAttributes;
   }

   public set customAttributes(value: Array<any>) {
      this._customAttributes = value;
   }


   public get trigger(): Trigger {
      return this._trigger;
   }

   public set trigger(value: Trigger) {
      this._trigger = value;
   }


   public get coupon(): Coupon {
      return this._coupon;
   }

   public set coupon(value: Coupon) {
      this._coupon = value;
   }


   public fromJson(activityData: any): void {
      this.id = activityData.id;
      this.name = activityData.name;
      this.payload = activityData.payload;
      this.scheme = activityData.scheme;

      if (activityData.hasOwnProperty('children')) {
         this.customAttributes = activityData.children.customattributes;
      }
   }


   public fromJsons(activityData: any, triggerData: any): void {
      this.id = activityData.id;
      this.name = activityData.name;
      this.payload = activityData.payload;
      this.scheme = activityData.scheme;

      if (activityData.hasOwnProperty('children')) {
         if (activityData.children.hasOwnProperty('customattributes')) {
            for (const customAttribue of activityData.children.customattributes) {
               this.customAttributes.push({
                  'name': customAttribue.name,
                  'value': customAttribue.value
               })
            }
         } else if (activityData.children.hasOwnProperty('coupons')) {
            this._coupon.fromJson(activityData.children.coupons[0]);
         }
      }

      this.trigger = new Trigger();
      this.trigger.fromJson(triggerData);
   }

   public toJson(): string {
      const activityJson = {
         'name': this.name,
         'payload': this.payload,
         'scheme': this.scheme,
         'trigger': this.trigger.toJson()
      }

      if (this.customAttributes.length > 0) {
         activityJson['attributes'] = JSON.stringify(this.customAttributes)
      }

      if (this.id)
         activityJson['id'] = this.id;

      return JSON.stringify(activityJson);
   }
}