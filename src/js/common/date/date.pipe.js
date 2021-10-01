import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

export class DatePipe extends Pipe {

	static transform(value, options = {}, language = null) { // = 'en-IN'
		if (value != null) { // !!! keep losing
			language = language || environment.currentLanguage;
			return new Intl.DateTimeFormat(language, options).format(value instanceof Date ? value : new Date(value));
		}
	}

	/*
	static transform(value, locale = 'it-IT-u-ca-gregory', options = {
		dateStyle: 'short',
		timeStyle: 'short',
	}) {
		const localeDateString = new Date(value).toLocaleDateString(locale, options);
		return localeDateString;
	}
	*/

}

DatePipe.meta = {
	name: 'date',
};
