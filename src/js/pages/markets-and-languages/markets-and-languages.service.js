import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class MarketsAndLanguagesService {

	static all$(currentCoId) {
		if (environment.flags.production) {
			return ApiService.get$('/markets-and-languages/all?currentCoId=' + currentCoId);
		} else {
			return ApiService.get$('/markets-and-languages/all.json');
		}
	}

}
