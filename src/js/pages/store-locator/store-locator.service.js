import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class StoreLocatorService {

	static all$() {
		return (
			environment.flags.production ?
				ApiService.get$(`/store-locator/all`) :
				ApiService.get$(`/store-locator/all.json`)
		).pipe(
			map(items => items.sort((a, b) => {
				return a.rank - b.rank;
			})),
		);
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/store-locator/filters');
		} else {
			return ApiService.get$('/store-locator/filters.json');
		}
	}

}
