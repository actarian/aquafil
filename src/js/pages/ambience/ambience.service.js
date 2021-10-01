import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class AmbienceService {

	static all$() {
		if (environment.flags.production) {
			return AmbienceService.sort$(ApiService.get$('/ambience/all'));
		} else {
			return AmbienceService.sort$(ApiService.get$('/ambience/all.json'));
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/ambience/filters');
		} else {
			return ApiService.get$('/ambience/filters.json');
		}
	}

	static sort$(items$) {
		return items$.pipe(
			map(items => {
				items.sort((a, b) => {
					if (a.configurable !== b.configurable) {
						return a.configurable ? -1 : 1;
					} else {
						return 0;
					}
				});
				/*
				if (environment.flags.cart) {
					items.sort((a, b) => {
						if (a.configurable !== b.configurable) {
							return a.configurable ? -1 : 1;
						} else {
							return 0;
						}
					});
				} else {
					items.forEach(x => x.configurable = false);
				}
				*/
				return items;
			}),
		);
	}

}
