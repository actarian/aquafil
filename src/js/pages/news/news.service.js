import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class NewsService {

	static all$() {
		if (environment.flags.production) {
			return ApiService.get$('/news/all');
		} else {
			return ApiService.get$('/news/all.json');
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/news/filters');
		} else {
			return ApiService.get$('/news/filters.json');
		}
	}

}
