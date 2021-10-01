


import { from, Observable, of } from 'rxjs';
import { concatMap, switchMap } from 'rxjs/operators';
import { environment } from '../../environment';
import { OnceService } from '../once/once.service';

export class GoogleMapsService {

	static maps;

	static init() {
		if (!environment.googleMaps || !environment.googleMaps.apiKey) {
			throw new Error('GoogleMapsService.error missing apiKey in environment.googleMaps');
		}
	}

	static maps$() {
		return new Observable().pipe(_ => {
			if (this.maps) {
				return of(this.maps);
			} else {
				return this.once$();
			}
		});
	}

	static once$() {
		if (!environment.googleMaps || !environment.googleMaps.apiKey) {
			throw new Error('GoogleMapsService.error missing apiKey in environment.googleMaps');
		}
		return OnceService.script$(`//maps.googleapis.com/maps/api/js?callback={{callback}}&key=${environment.googleMaps.apiKey}&libraries=places`, true).pipe(
			concatMap(_ => {
				this.maps = window.google.maps;
				return of(this.maps);
			})
		);
	}

	static geocode$(data) {
		// console.log('GoogleMapsService.geocode$', data);
		return GoogleMapsService.maps$().pipe(
			switchMap(maps => {
				// console.log('GoogleMapsService.geocode$', maps);
				return from(new Promise((resolve, reject) => {
					const geocoder = new maps.Geocoder();
					geocoder.geocode(data, (results, status) => {
						// console.log('GoogleMapsService.geocode$', status, results);
						if (status == 'OK') {
							resolve(results);
						} else {
							reject(results);
						}
					});
				}));
			}),
		);
	}

}
