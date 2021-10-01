import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class CareersService {

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/careers/data');
		} else {
			return ApiService.get$('/careers/data.json');
		}
	}

	static positions$() {
		if (environment.flags.production) {
			return ApiService.get$('/careers/positions');
		} else {
			return ApiService.get$('/careers/positions.json');
		}
	}

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/careers/submit', payload);
		} else {
			return ApiService.get$('/careers/submit.json');
		}
	}

}
