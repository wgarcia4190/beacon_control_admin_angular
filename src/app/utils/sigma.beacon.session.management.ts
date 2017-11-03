import { JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { User } from '../model/entities/user';

@Injectable()
export class SigmaBeaconSessionManagement {
	private _user: User;
	private jwtHelper: JwtHelper = new JwtHelper();

	public get user(): User {
		return this._user;
	}

	public set user(value: User) {
		this._user = value;

		this.jwtHelper.decodeToken(this._user.token);
		this.jwtHelper.getTokenExpirationDate(this._user.token);
		this.jwtHelper.isTokenExpired(this._user.token);

		localStorage.setItem('current_user', JSON.stringify(this._user));
	}

	public get isUserLogged(): boolean {
		return !this.jwtHelper.isTokenExpired(this._user.token);
	}

}