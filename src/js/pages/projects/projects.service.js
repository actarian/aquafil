import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class ProjectsService {

	static all$() {
		if (environment.flags.production) {
			return ApiService.get$('/projects/all');
		} else {
			return ApiService.get$('/projects/all.json');
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/projects/filters');
		} else {
			return ApiService.get$('/projects/filters.json');
		}
	}

}
