import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class ProjectsRegistrationService {

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/projects-registration/data');
		} else {
			return ApiService.get$('/projects-registration/data.json');
		}
	}

	static submit$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/projects-registration/submit', payload);
		} else {
			return ApiService.get$('/projects-registration/submit.json');
		}
	}

}
