import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class NewsletterService {

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/newsletter/data');
		} else {
			return ApiService.get$('/newsletter/data.json');
		}
	}

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/newsletter/submit', payload);
		} else {
			return ApiService.get$('/newsletter/submit.json');
		}
	}

}
