import { combineLatest } from 'rxjs';
import { FiltersComponent } from '../../shared/filters/filters.component';
import { ProjectsService } from './projects.service';

export class ProjectsComponent extends FiltersComponent {

	onInit() {
		super.onInit();
		this.categoryId = this.categoryId || null;
	}

	load$() {
		return combineLatest([
			ProjectsService.all$(),
			ProjectsService.filters$(),
		]);
	}

	setFiltersParams() {
		if (this.categoryId) {
			this.filters.category.set({ value: this.categoryId });
		}
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'category':
				return item.category.id === value;
			case 'search':
				return item.title.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					item.country.toLowerCase().indexOf(value.toLowerCase()) !== -1;
			default:
				return false;
		}
	}

}

ProjectsComponent.meta = {
	selector: '[projects]',
	inputs: ['categoryId'],
};
