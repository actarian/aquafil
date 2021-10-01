import { environment } from '../../environment';
import { HttpService } from '../http/http.service';
import { LanguageService } from '../language/language.service';

export class ApiService extends HttpService {

	static currentLanguage = LanguageService.activeLanguage;

	static get$(url, data, format) {
		return super.get$(`${environment.api}${url}`, data, format);
	}

	static delete$(url) {
		return super.delete$(`${environment.api}${url}`);
	}

	static post$(url, data) {
		return super.post$(`${environment.api}${url}`, data);
	}

	static put$(url, data) {
		return super.put$(`${environment.api}${url}`, data);
	}

	static patch$(url, data) {
		return super.patch$(`${environment.api}${url}`, data);
	}
}
