import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class ProductRequestService {

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.http$('POST', environment.api + '/wp-admin/admin-ajax.php', payload, 'application/x-www-form-urlencoded');
		} else {
			return ApiService.get$('/contacts/submit.json');
		}
	}

}
