import { Component } from 'rxcomp';
import { FormControl, FormGroup } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { FilterMode } from '../../common/filter/filter-item';
import { FilterService } from '../../common/filter/filter.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';

export const PAGE_SIZE = 24;

export class FiltersComponent extends Component {

	load$() {
		return combineLatest([
			of([]),
			of({ search: { mode: 'query' } }),
		]);
	}

	setFiltersParams() {
		// nope;
	}

	doFilterItem(key, item, value) {
		switch (key) {
			case 'search':
				return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					// item.address.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
					(item.city && item.city.toLowerCase().indexOf(value.toLowerCase()) !== -1) ||
					(item.countries && item.countries.find(x => x.label.toLowerCase().indexOf(value.toLowerCase()) !== -1))
			default:
				return false;
		}
	}

	onInit() {
		this.pageSize = PAGE_SIZE;
		this.items = [];
		this.filteredItems = [];
		this.visibleItems = [];
		this.filters = {};
		const form = this.form = new FormGroup({
			search: new FormControl(null),
		});
		const controls = this.controls = form.controls;
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			this.setFilterByKeyAndValue('search', form.value.search);
			this.pushChanges();
		});
		this.busy = true;
		this.load$().pipe(
			first(),
			finalize(_ => {
				this.busy = false;
				this.pushChanges();
			}),
		).subscribe(data => {
			this.items = data[0];
			this.filters = data[1];
			this.onLoad();
		});
	}

	onLoad() {
		const items = this.items;
		const filters = this.filters;
		Object.keys(filters).forEach(key => {
			filters[key].mode = filters[key].mode || FilterMode.OR;
		});
		const initialParams = {};
		const filterService = new FilterService(filters, initialParams, (key, filter) => {
			switch (key) {
				default:
					filter.filter = (item, value) => {
						return this.doFilterItem(key, item, value);
					};
			}
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		this.setFiltersParams();
		const search = this.filters.search.values.length ? this.filters.search.values[0] : null;
		this.form.patch({ search });
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = filteredItems;
			this.visibleItems = filteredItems.slice(0, Math.min(12, filteredItems.length));
			this.pushChanges();
			LocomotiveScrollService.update();
			LocomotiveScrollService.start();
			// console.log('FiltersComponent.filteredItems', filteredItems.length);
		});
	}

	showMore(event) {
		if (this.visibleItems.length + this.pageSize >= this.filteredItems.length) {
			this.visibleItems = this.filteredItems.slice();
		} else {
			this.visibleItems = this.filteredItems.slice(0, Math.min(this.visibleItems.length + this.pageSize, this.filteredItems.length));
		}
		this.pushChanges();
		LocomotiveScrollService.update();
	}

	onSearch(model) {
		// console.log('FiltersComponent.onSearch', this.form.value);
		/*
		this.setFilterByKeyAndValue('country', this.form.value.country);
		*/
		this.setFilterByKeyAndValue('search', this.form.value.search);
		this.pushChanges();
	}

	setFilterByKeyAndValue(key, value) {
		const filter = this.filters[key];
		if (filter) {
			if (filter.mode === FilterMode.QUERY) {
				filter.set(value);
			} else {
				const option = filter.options.find(x => x.value === value);
				// console.log(filter.options, option);
				if (option) {
					filter.set(option);
				} else {
					filter.clear();
				}
			}
		}
	}

	onFilterDidChange() {
		this.pushChanges();
	}

}

FiltersComponent.meta = {
	selector: '[filters]',
};
