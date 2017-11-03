import { Entity } from './entity';
export class Floor implements Entity {
   private _name: string;

   public get name(): string {
      return this._name;
   }

   public set name(value: string) {
      this._name = value;
   }

   public fromJson(floorJson: string): void {
      this.name = 'N/A';
   }

   public toJson(): string {
      return '';
   }

}
