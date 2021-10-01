import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

const DIVISIONS = [
	{ amount: 60, name: 'seconds' },
	{ amount: 60, name: 'minutes' },
	{ amount: 24, name: 'hours' },
	{ amount: 7, name: 'days' },
	{ amount: 4.34524, name: 'weeks' },
	{ amount: 12, name: 'months' },
	{ amount: Number.POSITIVE_INFINITY, name: 'years' }
];

export class RelativeDatePipe extends Pipe {

	static transform(value, options = { numeric: 'auto' }, language = null) { // = 'en-IN'
		if (value != null) { // !!! keep losing
			const date = value instanceof Date ? value : new Date(value);
			language = language || environment.currentLanguage;
			const formatter = new Intl.RelativeTimeFormat(language, options);
			let duration = (date - new Date()) / 1000;
			for (let i = 0; i <= DIVISIONS.length; i++) {
				const division = DIVISIONS[i];
				if (Math.abs(duration) < division.amount) {
					return formatter.format(Math.round(duration), division.name);
				}
				duration /= division.amount;
			}
		}
	}

}

RelativeDatePipe.meta = {
	name: 'relativeDate',
};
