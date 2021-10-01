
import { from, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

export class OnceService {

	static uid = 0;
	static paths = [];

	static script$(url, callback) {
		// console.log('OnceScript.script$', url, callback);
		let item = this.paths.find(x => x.url === url);
		if (item != null) {
			return item.callback$;
		} else {
			item = { url, callbacks$: null };
			this.paths.push(item);
			let callbackName;
			if (callback === true) {
				callbackName = 'OnceCallback' + (++this.uid);
				url = url.split('{{callback}}').join(callbackName);
			} else {
				callbackName = callback;
			}
			let callback$;
			const script = document.createElement('script');
			script.type = 'text/javascript';
			if (callback) {
				callback$ = from(
					new Promise((resolve, reject) => {
						window[callbackName] = function(data) {
							// console.log('OnceScript', callbackName, data);
							resolve(data);
						};
					})
				);
			} else {
				script.async = true;
				callback$ = fromEvent(script, 'load').pipe(
					map(x => x)
				);
			}
			item.callback$ = callback$;
			const scripts = Array.prototype.slice.call(document.getElementsByTagName('script'));
			if (scripts.length) {
				script.src = url;
				const lastScript = scripts[scripts.length - 1];
				lastScript.parentNode.insertBefore(script, lastScript.nextSibling);
			}
			// console.log('OnceScript.script$', scripts.length, script.src, scripts.map(x => x.src).join(', '));
			return callback$;
		}
	}

}
