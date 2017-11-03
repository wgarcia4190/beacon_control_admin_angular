import { Zone } from './zone';

export class User {
   private _token: string;
   private _id: number;
   private _email: string;
   private _factoryUUID: string;
   private _zones: Array<Zone>;
   private _roles: Array<string>;
   private _applicationId: number;

   public get token(): string {
      return this._token;
   }

   public set token(value: string) {
      this._token = value;
   }

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get email(): string {
      return this._email;
   }

   public set email(value: string) {
      this._email = value;
   }

   public get factoryUUID(): string {
      return this._factoryUUID;
   }

   public set factoryUUID(value: string) {
      this._factoryUUID = value;
   }

   public get zones(): Array<Zone> {
      return this._zones;
   }

   public set zones(value: Array<Zone>) {
      this._zones = value;
   }

   public get roles(): Array<string> {
      return this._roles;
   }

   public set roles(value: Array<string>) {
      this._roles = value;
   }


   public get applicationId(): number {
      return this._applicationId;
   }

   public set applicationId(value: number) {
      this._applicationId = value;
   }


   public fromJSON(data: any) {
      const userJson = JSON.parse(data);

      this.email = userJson.email;
      this.factoryUUID = userJson['default_beacon_uuid'];
      this.id = userJson.id;
      this.roles = [userJson.role];
   }

}
