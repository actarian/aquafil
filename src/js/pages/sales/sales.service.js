import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class SalesService {

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/sales/data');
		} else {
			return ApiService.get$('/contacts/data.json');
		}
	}

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/sales/submit', payload);
		} else {
			return ApiService.get$('/contacts/submit.json');
		}
	}

}
