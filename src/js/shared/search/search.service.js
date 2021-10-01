import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class SearchService {

	static search$_() {
		if (SearchService.items_) {
			return of(SearchService.items_);
		} else {
			return (
				environment.flags.production ?
					ApiService.get$(`/search/search`) :
					ApiService.get$(`/search/search.json`)
			).pipe(
				tap(items => {
					items.forEach(item => {
						item.title = SearchService.toTitleCase(item.title);
					});
					SearchService.items_ = items;
				}),
			);
		}
	}

	static search$(query) {
		query = query.toLowerCase();
		return this.search$_().pipe(
			map(items => {
				items = items.filter(item => item.title.toLowerCase().indexOf(query) !== -1);
				items.sort((a, b) => {
					return a.title.toLowerCase().indexOf(query) - b.title.toLowerCase().indexOf(query);
				});
				return items;
			}),
		);
	}

	static toTitleCase(sentence, seps = ' _-/') {
		const capitalize = str => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
		const escape = str => str.replace(/./g, c => `\\${c}`);
		let wordPattern = new RegExp(`[^${escape(seps)}]+`, 'g');
		return sentence.replace(wordPattern, capitalize);
	}

}
