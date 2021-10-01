import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { SessionStorageService } from '../../common/storage/session-storage.service';
import { environment } from '../../environment';

export const UserViews = {
	SIGN_IN: 1,
	SIGN_UP: 2,
	FORGOTTEN: 3,
	EDIT: 4,
};

export class User {

	get shortName() {
		return (this.firstName || '?').substr(0, 1).toUpperCase() + (this.lastName || '?').substr(0, 1).toUpperCase();
	}

	get fullName() {
		return this.firstName + ' ' + this.lastName;
	}

	constructor(data) {
		if (data) {
			Object.assign(this, data);
		}
	}

}

export class UserService {

	static user$_ = new BehaviorSubject(null);

	static get currentUser() {
		return this.user$_.getValue();
	}

	static setUser(user) {
		if (user) {
			SessionStorageService.set('user', user);
		} else {
			SessionStorageService.delete('user');
		}
		this.user$_.next(user);
	}

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/aquafil/user/data');
		} else {
			return ApiService.get$('/user/data.json');
		}
	}

	static forgot$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/aquafil/user/forgot', payload);
		} else {
			return ApiService.get$(`/user/forgot.json`);
		}
	}

	static me$() {
		if (UserService.busyMe) {
			return this.user$_;
		} else {
			UserService.busyMe = true;
			return of(1).pipe(
				switchMap(_ => {
					if (environment.flags.production) {
						return ApiService.get$(`/aquafil/user/me`);
					} else {
						const sessionUser = SessionStorageService.get('user');
						if (sessionUser) {
							return of(sessionUser);
						} else {
							return ApiService.get$(`/user/me.json`);
						}
					}
				}),
				map((user) => {
					console.log('UserService.user$', user);
					return this.mapUser(user);
				}),
				catchError(_ => of(null)),
				switchMap(user => {
					this.setUser(user);
					return this.user$_;
				}),
			)
		}
	}

	static signin$(payload) {
		return (
			environment.flags.production ? ApiService.post$(`/aquafil/user/signin`, payload) : ApiService.get$(`/user/signin.json`)
		).pipe(
			map((response) => this.mapUser(response)),
			tap((user) => this.setUser(user)),
		);
	}

	static signout$() {
		return (
			environment.flags.production ? ApiService.post$(`/aquafil/user/signout`) : ApiService.get$(`/user/signout.json`)
		).pipe(
			tap((_) => this.setUser(null)),
		);
	}

	static signup$(payload) {
		// console.log('UserService.signup$', payload);
		return (
			environment.flags.production ? ApiService.post$(`/aquafil/user/signup`, payload) : ApiService.get$(`/user/signup.json`)
		).pipe(
			map((response) => {
				response.user = this.mapUser(response.user);
				return response;
			}),
			tap((response) => this.setUser(response.user)),
			//document.location.reload(),
		);
	}

	static edit$(payload) {
		// console.log('UserService.edit$', payload);
		return (
			environment.flags.production ? ApiService.post$(`/aquafil/user/edit`, payload) : ApiService.get$(`/user/edit.json`)
		).pipe(
			map((response) => {
				response.user = this.mapUser(response.user);
				return response;
			}),
			tap((response) => this.setUser(response.user)),
			//document.location.reload(),
		);
	}

	static editPassword$(payload) {
		// console.log('UserService.editPassword$', payload);
		return (
			environment.flags.production ?
				ApiService.post$(`/aquafil/user/edit-password`, payload) :
				ApiService.get$(`/user/edit-password.json`)
		);
	}

	static accessData$(payload) {
		// console.log('UserService.accessData$', payload);
		return (
			environment.flags.production ?
				ApiService.post$(`/aquafil/user/access-data`, payload) :
				ApiService.get$(`/user/access-data.json`)
		);
	}

	static delete$(payload) {
		// console.log('UserService.delete$', payload);
		return (
			environment.flags.production ?
				ApiService.post$(`/aquafil/user/delete`, payload) :
				ApiService.get$(`/user/delete.json`)
		);
	}

	static gdpr$() {
		if (environment.flags.production) {
			return ApiService.get$('/aquafil/user/gdpr');
		} else {
			return ApiService.get$('/user/gdpr.json');
		}
	}

	static tryFacebook$(me) {
		return of(null);
	}

	static tryGoogle$(me) {
		return of(null);
	}

	static tryLinkedin$(me) {
		return of(null);
	}

	static sessionStorage$() {
		return of(SessionStorageService.get('user') || null);
	}

	static mapUser(user) {
		return user ? new User(user) : null;
	}

	static mapUsers(users) {
		return users ? users.map(x => UserService.mapUser(x)) : [];
	}

}
