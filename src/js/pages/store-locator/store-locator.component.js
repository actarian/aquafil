import { combineLatest } from 'rxjs';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { StoreLocatorService } from './store-locator.service';

export class StoreLocatorComponent extends FiltersComponent {

	load$() {
		return combineLatest([
			StoreLocatorService.all$(),
			StoreLocatorService.filters$(),
		]);
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'country':
				return item.country && item.country.id === value;
			case 'category':
				return item.category && item.category.id === value;
			case 'search':
				return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					// item.address.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					item.city.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					item.country.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			default:
				return false;
		}
	}

}

StoreLocatorComponent.meta = {
	selector: '[store-locator]',
};
