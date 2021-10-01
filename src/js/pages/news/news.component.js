import { combineLatest } from 'rxjs';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { NewsService } from './news.service';

export class NewsComponent extends FiltersComponent {

	load$() {
		return combineLatest([
			NewsService.all$(),
			NewsService.filters$(),
		]);
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'country':
				return item.country.id === value;
			case 'search':
				return item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					item.abstract.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			default:
				return false;
		}
	}

}

NewsComponent.meta = {
	selector: '[news]',
};
