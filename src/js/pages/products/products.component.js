import { combineLatest } from 'rxjs';
import { environment } from '../../environment';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { ProductsService } from './products.service';

export const SHOP_OPTION_ID = environment.flags.production ? 1 : 1;

export class ProductsComponent extends FiltersComponent {

	onInit() {
		super.onInit();
		this.categoryId = this.categoryId || null;
		this.shop = this.shop || false;
	}

	load$() {
		return combineLatest([
			ProductsService.all$(),
			ProductsService.filters$(),
		]);
	}

	setFiltersParams() {
		if (this.categoryId) {
			this.filters.category.set({ value: this.categoryId });
		}
		if (this.shop) {
			this.filters.shop.set({ value: SHOP_OPTION_ID });
		}
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'category':
				return item.category.id === value;
			case 'subcategory':
				return item.subcategories.indexOf(value) !== -1;
			case 'ambience':
				return item.ambiences.indexOf(value) !== -1;
			case 'material':
				return item.materials.indexOf(value) !== -1;
			case 'designer':
				return item.designers.indexOf(value) !== -1;
			case 'shop':
				return value === SHOP_OPTION_ID ? item.configurable : true;
			case 'search':
				return item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			default:
				return false;
		}
	}

}

ProductsComponent.meta = {
	selector: '[products]',
	inputs: ['categoryId', 'shop'],
};
