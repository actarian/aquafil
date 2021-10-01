import { combineLatest } from 'rxjs';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { DesignersService } from './designers.service';

export class DesignersComponent extends FiltersComponent {

	load$() {
		return combineLatest([
			DesignersService.all$(),
			DesignersService.filters$(),
		]);
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'category':
				return item.category.id === value;
			case 'search':
				return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			default:
				return false;
		}
	}

}

DesignersComponent.meta = {
	selector: '[designers]',
};
