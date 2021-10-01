import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class DealersService {

	static all$() {
		if (environment.flags.production) {
			return ApiService.get$('/dealers/all').pipe(
				map(items => items.sort((a, b) => {
					return b.regions.length - a.regions.length;
				})),
			);
		} else {
			return ApiService.get$('/dealers/all.json').pipe(
				map(items => items.sort((a, b) => {
					return b.regions.length - a.regions.length;
				})),
			);
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/dealers/filters');
		} else {
			return ApiService.get$('/dealers/filters.json');
		}
	}

}
