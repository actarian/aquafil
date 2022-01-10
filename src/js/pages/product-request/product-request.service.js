import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class ProductRequestService {

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/product-request/submit', payload);
		} else {
			return ApiService.get$('/contacts/submit.json');
		}
	}

}
