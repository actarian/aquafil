


import { from, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { environment } from '../../environment';
import { OnceService } from '../once/once.service';
import { LocalStorageService } from '../storage/local-storage.service';

/*
export class GoogleConfig {
	public clientId: string;
	public cookiepolicy?: string = 'single_host_origin';
	public scope?: string = 'profile email';
	public fetch_basic_profile?: boolean = true;
	public ux_mode?: string = 'popup';
}

export class GoogleAuthResponse {
	token_type: string;
	access_token: string;
	scope: string;
	login_hint: string;
	expires_in: number;
	expires_at: number;
	first_issued_at: number;
	id_token: string;
	idpId: string;
	signedRequest: string;
	userID: string;
}

export class GoogleUser {
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	name: string;
	picture: string;
	authResponse?: GoogleAuthResponse;
	googleToken?: string;
}
*/

export class GoogleService {

	static authResponse;
	static storage;
	static gapi;
	static auth2;
	static instance;

	static init() {
		/*
		if (!environment['plugins'] && !environment['plugins']['google']) {
			throw new Error('GoogleService.error missing config object in environment.plugins.google');
		}
		*/
		this.authResponse = LocalStorageService.get('google');
		// console.log('GoogleService.authResponse', this.authResponse);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*  call GoogleService.google on component OnInit to avoid popup blockers via asyncronous loading *
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	static google$() {
		return new Observable().pipe(x => {
			if (this.gapi) {
				return of(this.gapi);
			} else {
				return this.once$();
			}
		});
	}

	static once$() {
		return OnceService.script$('//apis.google.com/js/api:client.js?onload={{callback}}', true).pipe(
			concatMap(x => {
				this.gapi = window['gapi'];
				return of(this.gapi);
			})
		);
	}

	static me$() {
		return this.login$().pipe(
			concatMap(x => {
				const profile = this.instance.currentUser.get().getBasicProfile();
				const user = {
					id: profile.getId(),
					name: profile.getName(),
					firstName: profile.getGivenName(),
					lastName: profile.getFamilyName(),
					picture: profile.getImageUrl(),
					email: profile.getEmail(),
					authResponse: this.authResponse,
					googleToken: this.authResponse.access_token,
				};
				return of(user);
			})
		);
	}

	static login$() {
		return this.auth2Instance$().pipe(
			concatMap(x => {
				return this.signin$();
			})
		);
	}

	static logout$() {
		return this.auth2Instance$().pipe(
			concatMap(x => {
				return from(
					new Promise((resolve, reject) => {
						if (this.instance.isSignedIn && this.instance.isSignedIn.get()) {
							this.instance.signOut().then((signed) => {
								resolve();
							}, reject);
						} else {
							resolve();
						}
					})
				);
			})
		);
	}

	static getAuth2$() {
		return new Observable().pipe(x => {
			if (this.auth2) {
				return of(this.auth2);
			} else {
				return this.google$().pipe(
					concatMap(x => {
						if (this.gapi.auth2) {
							return this.auth2init$();
						} else {
							return from(
								new Promise((resolve, reject) => {
									this.gapi.load('auth2', () => {
										setTimeout(() => {
											resolve();
										}, 200);
									}, reject);
								})
							).pipe(
								concatMap(x => {
									return this.auth2init$();
								})
							);
						}
					})
				);
			}
		});
	}

	static signin$() {
		return from(
			new Promise((resolve, reject) => {
				const readAccessToken = () => {
					// console.log('GoogleLogin.readAccessToken');
					try {
						const user = this.instance.currentUser.get().getAuthResponse(true);
						// console.log('GoogleLogin.readAccessToken.success', user);
						this.authResponse = user;
						LocalStorageService.set('google', user);
						resolve({
							code: user.access_token,
						});
					} catch (error) {
						console.log('GoogleLogin.readAccessToken.error', error);
						LocalStorageService.delete('google');
						reject(error);
					}
				};
				if (this.instance.isSignedIn && this.instance.isSignedIn.get()) {
					readAccessToken();
				} else {
					this.instance.signIn({
						scope: 'profile email',
					}).then((signed) => {
						readAccessToken();
					}, (error) => {
						LocalStorageService.delete('google');
						reject(error);
					});
				}
			})
		);
	}

	static auth2init$() {
		return from(
			new Promise((resolve, reject) => {
				this.gapi.auth2.init({
					client_id: environment.google.clientId,
					cookiepolicy: 'single_host_origin',
					scope: 'profile email',
					fetch_basic_profile: true,
					ux_mode: 'popup',
				}).then(() => {
					this.auth2 = this.gapi.auth2;
					// console.log('Auth2Init.success', this.auth2);
					resolve(this.auth2);
				}, reject);
			})
		);
	}

	static auth2Instance$() {
		if (this.instance) {
			return of(this.instance);
		} else {
			return this.getAuth2$().pipe(
				concatMap(x => {
					this.instance = this.auth2.getAuthInstance();
					return of(this.instance);
				})
			);
		}
	}

}
