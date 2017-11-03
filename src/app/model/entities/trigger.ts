import { Entity } from './entity';

export class Trigger implements Entity {
	private _id: number;
	private _eventType: string;
	private _type: string;
	private _test: boolean;
	private _applicationId: number;
	private _sources: Array<any> = new Array<any>();

	public get id(): number {
		return this._id;
	}

	public set id(value: number) {
		this._id = value;
	}


	public get eventType(): string {
		return this._eventType;
	}

	public set eventType(value: string) {
		this._eventType = value;
	}


	public get type(): string {
		return this._type;
	}

	public set type(value: string) {
		this._type = value;
	}

	public get test(): boolean {
		return this._test;
	}

	public set test(value: boolean) {
		this._test = value;
	}


	public get sources(): Array<any> {
		return this._sources;
	}

	public set sources(value: Array<any>) {
		this._sources = value;
	}


	public get applicationId(): number {
		return this._applicationId;
	}

	public set applicationId(value: number) {
		this._applicationId = value;
	}


	public fromJson(triggerData: any): void {
		this.applicationId = triggerData.application_id;
		this.eventType = triggerData.event_type;
		this.id = triggerData.id;
		this.type = triggerData.type;

		if (triggerData.hasOwnProperty('children')) {
			this.sources = triggerData.children.triggersources;
		}
	}

	public toJson(): string {
		const triggerJson = {
			'event_type': this.eventType,
			'type': this.type,
			'test': this.test,
			'sources': JSON.stringify(this.sources),
			'application_id': this.applicationId
		}

		if (this.id)
			triggerJson['id'] = this.id;

		return JSON.stringify(triggerJson);
	}
}