import { Entity } from './entity';

export class Coupon implements Entity {
	private _id: number;
	private _template: string = '';
	private _name: string = '';
	private _title: string = '';
	private _description: string = '';
	private _activityId: number = 0;
	private _identifierNumber: number = 0;
	private _uniqueIdentifierNumber: number = 0;
	private _encodingType: string = '';
	private _buttonFontColor: string = '';
	private _buttonBackgroundColor: string = '';
	private _buttonLabel: string = '';
	private _buttonLink: string = '';
	private _couponImages: Array<any> = new Array<any>();


	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}

	public get template(): string {
		return this._template;
	}

	public set template(value: string) {
		this._template = value;
	}

	public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get title(): string {
		return this._title;
	}

	public set title(value: string) {
		this._title = value;
	}

	public get description(): string {
		return this._description;
	}

	public set description(value: string) {
		this._description = value;
	}

	public get identifierNumber(): number {
		return this._identifierNumber;
	}

	public set identifierNumber(value: number) {
		this._identifierNumber = value;
	}

	public get uniqueIdentifierNumber(): number {
		return this._uniqueIdentifierNumber;
	}

	public set uniqueIdentifierNumber(value: number) {
		this._uniqueIdentifierNumber = value;
	}

	public get encodingType(): string {
		return this._encodingType;
	}

	public set encodingType(value: string) {
		this._encodingType = value;
	}

	public get buttonFontColor(): string {
		return this._buttonFontColor;
	}

	public set buttonFontColor(value: string) {
		this._buttonFontColor = value;
	}

	public get buttonLabel(): string {
		return this._buttonLabel;
	}

	public set buttonLabel(value: string) {
		this._buttonLabel = value;
	}

	public get buttonLink(): string {
		return this._buttonLink;
	}

	public set buttonLink(value: string) {
		this._buttonLink = value;
	}

	public get couponImages(): Array<any> {
		return this._couponImages;
	}

	public set couponImages(value: Array<any>) {
		this._couponImages = value;
	}

	public get activityId(): number {
		return this._activityId;
	}

	public set activityId(value: number) {
		this._activityId = value;
	}

	public get buttonBackgroundColor(): string {
		return this._buttonBackgroundColor;
	}

	public set buttonBackgroundColor(value: string) {
		this._buttonBackgroundColor = value;
	}

	public toJson(): string {
		const couponJson = {
			'template': this.template,
			'name': this.name,
			'title': this.title,
			'description': this.description,
			'activity_id': this.activityId,
			'identifier_number': this.identifierNumber,
			'unique_identifier_number': this.uniqueIdentifierNumber,
			'encoding_type': this.encodingType,
			'button_font_color': this.buttonFontColor,
			'button_background_color': this.buttonBackgroundColor,
			'button_label': this.buttonLabel,
			'button_link': this.buttonLink
		}

		if (this.id) {
			couponJson['id'] = this.id;
		}

		return JSON.stringify(couponJson);
	}

	public fromJson(couponData: any): void {
		this.activityId = couponData.activity_id;
		this.buttonBackgroundColor = couponData.button_background_color;
		this.buttonFontColor = couponData.button_font_color;
		this.buttonLabel = couponData.button_label;
		this.buttonLink = couponData.button_link;
		this.description = couponData.description;
		this.encodingType = couponData.encoding_type;
		this.id = couponData.id;
		this.identifierNumber = couponData.identifier_number;
		this.name = couponData.name;
		this.template = couponData.template;
		this.title = couponData.title;
		this.uniqueIdentifierNumber = couponData.unique_identifier_number;
	}

}