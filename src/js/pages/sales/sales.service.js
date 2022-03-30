import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class SalesService {

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/wp-json/aquafil/v1/sales?page=' + ws_vars.post_id);
		} else {
			return ApiService.get$('/contacts/data.json');
		}
	}

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.http$('POST', environment.api + '/wp-admin/admin-ajax.php', payload, 'application/x-www-form-urlencoded');
		} else {
			return ApiService.get$('/contacts/submit.json');
		}
	}

}
