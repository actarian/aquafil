import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

export class NumberPipe extends Pipe {

	static transform(value, options = {}, language = null) { // = 'en-IN'
		if (value != null) { // !!! keep losing
			language = language || environment.currentLanguage;
			return new Intl.NumberFormat(language, options).format(value);
		}
	}

}

NumberPipe.meta = {
	name: 'number',
};
