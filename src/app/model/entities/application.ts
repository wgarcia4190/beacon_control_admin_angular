export class Application {
   private _name: string;
   private _id: number;
   private _secret: string;
   private _uid: string;

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


   public get secret(): string {
      return this._secret;
   }

   public set secret(value: string) {
      this._secret = value;
   }


   public get uid(): string {
      return this._uid;
   }

   public set uid(value: string) {
      this._uid = value;
   }


   public toJson(): string {
      const appJson = {
         'name': this.name,
         'test': true,
         'default': false
      }

      return JSON.stringify(appJson);
   }

   public fromJson(data: any): void {
      const applicationJson = JSON.parse(data.application);
      const credentialsJson = JSON.parse(data.credentials);

      this.name = applicationJson.name;
      this.id = applicationJson.id;
      this.secret = credentialsJson.secret;
      this.uid = credentialsJson.uid;
   }

}
