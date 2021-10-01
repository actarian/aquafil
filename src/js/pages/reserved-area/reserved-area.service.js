import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';
import { FilesService } from '../../shared/files/files.service';

export class ReservedAreaService {

	static all$() {
		return (
			environment.flags.production ?
				ApiService.post$(`/reserved-area/all`) :
				ApiService.get$(`/reserved-area/all.json`)
		).pipe(
			map(items => {
				items.forEach(x => {
					x.title = ReservedAreaService.toTitleCase(x.title.replace(/_/g, ' '));
				});
				return items;
			}),
		);
	}

	static all_$() {
		return combineLatest([ReservedAreaService.get$(), FilesService.files$()]).pipe(
			map(data => {
				const items = data[0];
				const files = data[1];
				items.forEach(item => {
					if (files.find(x => x.id === item.id)) {
						item.added = true;
					} else {
						item.added = false;
					}
				});
				return items;
			})
		);
	}

	static toTitleCase(sentence, seps = ' _-/') {
		const capitalize = str => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
		const escape = str => str.replace(/./g, c => `\\${c}`);
		let wordPattern = new RegExp(`[^${escape(seps)}]+`, 'g');
		return sentence.replace(wordPattern, capitalize);
	}

}
