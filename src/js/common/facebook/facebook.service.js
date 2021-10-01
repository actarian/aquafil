
/*
<script>
  window.fbAsyncInit = function() {
	FB.init({
	  appId      : '{your-app-id}',
	  cookie     : true,
	  xfbml      : true,
	  version    : '{api-version}'
	});

	FB.AppEvents.logPageView();

  };

  (function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "https://connect.facebook.net/en_US/sdk.js";
	 fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>


1. check status (already logged?)
FB.getLoginStatus(function(response) {
	statusChangeCallback(response);
	{
		status: 'connected',
		authResponse: {
			accessToken: '...',
			expiresIn:'...',
			signedRequest:'...',
			userID:'...'
		}
	}
});

2. login
FB.login(function(response) {
  if (response.status === 'connected') {
	// Logged into your webpage and Facebook.
  } else {
	// The person is not logged into your webpage or we are unable to tell.
  }
}, {scope: 'public_profile,email'});

3. logout
FB.logout(function(response) {
   // Person is now logged out
});


function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
	console.log('statusChangeCallback');
	console.log(response);                   // The current login status of the person.
	if (response.status === 'connected') {   // Logged into your webpage and Facebook.
	  testAPI();
	} else {                                 // Not logged into your webpage or we are unable to tell.
	  document.getElementById('status').innerHTML = 'Please log ' +
		'into this webpage.';
	}
  }

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
	console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
	  console.log('Successful login for: ' + response.name);
	  document.getElementById('status').innerHTML =
		'Thanks for logging in, ' + response.name + '!';
	});
  }

*/

/*
static init(document, tagName, id) {
	let script;
	let firstTagName = document.getElementsByTagName(tagName)[0];
	if (document.getElementById(id)) {
		return;
	}
	script = document.createElement(tagName);
	script.id = id;
	script.src = 'https://connect.facebook.net/en_US/sdk.js';
	firstTagName.parentNode.insertBefore(script, firstTagName);
}
*/

import { from, of } from "rxjs";
import { catchError, concatMap, filter, switchMap } from "rxjs/operators";
import { environment } from "../../environment";
import { OnceService } from "../once/once.service";
import { LocalStorageService } from "../storage/local-storage.service";

export class FacebookService {

	static facebook_ = null;
	static authResponse_ = null;

	static facebook$() {
		if (window.location.protocol.indexOf('https') !== -1) {
			if (this.facebook_) {
				return of(this.facebook_);
			} else {
				return OnceService.script$('//connect.facebook.net/' + environment.currentLanguage + '/sdk.js', 'fbAsyncInit').pipe(
					concatMap(x => {
						const facebook = window['FB'];
						facebook.init({
							appId: environment.facebook.appId,
							// status: true,
							cookie: true,
							xfbml: true,
							version: environment.facebook.version,
						});
						facebook.AppEvents.logPageView();
						this.facebook_ = facebook;
						return of(facebook);
					})
				);
			}
		} else {
			return of(null);
		}
	}

	static status$() {
		return this.facebook$().pipe(
			filter(facebook => facebook !== null),
			concatMap(facebook => {
				return from(new Promise((resolve, reject) => {
					facebook.getLoginStatus((response) => {
						this.authResponse_ = null;
						if (response.status === 'connected') {
							this.authResponse_ = response.authResponse;
							LocalStorageService.set('facebook', response.authResponse);
							resolve(response);
						} else if (response.status === 'not_authorized') {
							LocalStorageService.delete('facebook');
							reject(response);
						} else {
							reject(response);
						}
					}, { scope: environment.facebook.scope });
				}));
			})
		);
	}

	static login$() {
		return this.facebook$().pipe(
			filter(facebook => facebook !== null),
			concatMap(facebook => {
				return from(new Promise((resolve, reject) => {
					facebook.login((response) => {
						this.authResponse_ = null;
						if (response.status === 'connected') {
							this.authResponse_ = response.authResponse;
							LocalStorageService.set('facebook', response.authResponse);
							resolve(response);
						} else if (response.status === 'not_authorized') {
							LocalStorageService.delete('facebook');
							reject(response);
						} else {
							reject(response);
						}
					}, { scope: environment.facebook.scope });
				}));
			})
		);
	}

	static logout$() {
		return this.status$().pipe(
			catchError(error => {
				LocalStorageService.delete('facebook');
				return of(null);
			}),
			switchMap(_ => {
				return from(new Promise((resolve, reject) => {
					this.facebook_.logout(response => {
						resolve(response);
						LocalStorageService.delete('facebook');
					});
				}));
			})
		);
	}

	static me$(fields) {
		return this.status$().pipe(
			catchError(error => {
				return this.login$();
			}),
			concatMap(l => {
				return from(new Promise((resolve, reject) => {
					fields = fields || environment.facebook.fields;
					this.facebook_.api('/me', {
						fields: fields,
						accessToken: environment.facebook.tokenClient,
					}, (response) => {
						if (!response || response.error) {
							const error = response ? response.error : 'error';
							console.log('FacebookService.getMe.error', error);
							reject(response.error);
						} else {
							const user = response;
							user.authResponse = this.authResponse_;
							user.facebookToken = this.authResponse_.accessToken;
							resolve(user);
						}
					});
				}));
			})
		);
	}

}
