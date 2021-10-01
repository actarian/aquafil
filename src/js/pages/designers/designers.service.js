import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class DesignersService {

	static all$() {
		if (environment.flags.production) {
			return ApiService.get$('/designers/all');
		} else {
			return ApiService.get$('/designers/all.json');
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/designers/filters');
		} else {
			return ApiService.get$('/designers/filters.json');
		}
	}

}
