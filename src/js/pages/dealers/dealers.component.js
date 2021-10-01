import { combineLatest } from 'rxjs';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { DealersService } from './dealers.service';

export class DealersComponent extends FiltersComponent {

	load$() {
		return combineLatest([
			DealersService.all$(),
			DealersService.filters$(),
		]);
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'country':
				return item.countries && item.countries.find(x => x.value === value);
			case 'search':
				return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					// item.address.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					(item.city && item.city.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
					(item.countries && item.countries.find(x => x.label.toLowerCase().indexOf(value.toLowerCase()) !== -1))
			default:
				return false;
		}
	}

}

DealersComponent.meta = {
	selector: '[dealers]',
};
