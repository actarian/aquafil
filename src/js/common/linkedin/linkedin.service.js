


import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environment';
import { ApiService } from '../api/api.service';
import { LocalStorageService } from '../storage/local-storage.service';

export class LinkedinService {

	static getAccessToken$(code) {
		const data = {
			grant_type: 'authorization_code',
			code: code,
			client_id: environment.linkedIn.clientId,
			client_secret: environment.linkedIn.clientSecret,
			redirect_uri: `${window.location.origin}/aquafil/cart.html`,
		}
		if (environment.flags.production) {
			return ApiService.post$('/user/linkedin', data);
		} else {
			return ApiService.get$('/user/linkedin.json');
		}
	}

	static linkedin$() {
		const event$ = new Subject();
		const key = 'linkedin';
		const state = `${key}-${new Date().getTime()}`;
		window.onSocialCallback = (social, params) => {
			if (social === 'linkedin' && params.state === state) {
				console.log('onSocialCallback', params.code);
				event$.next(params.code);
			}
		}
		const width = 375 * 2;
		const height = 667;
		window.open(
			`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedIn.clientId}&redirect_uri=${window.location.origin}/aquafil/cart.html&state=${state}&scope=${environment.linkedIn.scope}`,
			key,
			`top=${Math.floor((window.innerHeight - height) / 2)}, left=${Math.floor((window.innerWidth - width) / 2)}, width=${width}, height=${height}, status=no, menubar=no, toolbar=no scrollbars=no`,
		);
		// https://localhost:48481/aquafil/cart.html?code=AQRqT4xWst4rcKM_sarxRTHP7PJ_eUbiQP30KZuyjGgSuoNQjZzJtSIu6laX6o-R-hy9obrIhzRKA3EshZfkIgo-ErIEahuyyAkY7Lg5PRFCEDdJxiy-cKyz8O9Vl6wVs2hoO_m7QvhLB22YfL_qqtToWqEUvWLwWqVTzRgEbu_U2AWDltOP_mSVNLge3Qc_uRV6VZDPeQqPcY2ICgo&state=foobar
		return event$.pipe(
			switchMap(code => {
				return this.getAccessToken$(code);
			}),
			tap(accessToken => {
				LocalStorageService.set('linkedin', accessToken);
			}),
		);
	}

}
