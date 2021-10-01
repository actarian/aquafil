import { Component } from 'rxcomp';
import { FormControl, FormGroup } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { FilterMode } from '../../common/filter/filter-item';
import { FilterService } from '../../common/filter/filter.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { environment } from '../../environment';
import { MaterialsService } from './materials.service';

export class MaterialsComponent extends Component {

	onInit() {
		this.categories = [];
		this.selectedItem = null;
		this.items = [];
		this.filteredItems = [];
		this.visibleItems = [];
		this.filters = {};
		const form = this.form = new FormGroup({
			category: new FormControl(null),
		});
		const controls = this.controls = form.controls;
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			this.setFilterByKeyAndValue('category', form.value.category);
			this.pushChanges();
		});
		this.load$().pipe(
			first(),
		).subscribe(data => {
			this.items = data[0];
			this.filters = data[1];
			controls.category.options = FormService.toSelectOptions(this.filters.category.options);
			this.onLoad();
			this.pushChanges();
		});
	}

	load$() {
		return combineLatest([
			MaterialsService.all$(),
			MaterialsService.filters$(),
		]);
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
						switch (key) {
							case 'category':
								return item.category.id === value;
							default:
						}
					};
			}
		});
		this.filterService = filterService;
		this.filters = filterService.filters;
		this.categories = this.filters.category.options.filter(x => x.value);
		const category = this.filters.category.values.length ? this.filters.category.values[0] : null;
		this.form.patch({ category, search });
		filterService.items$(items).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(filteredItems => {
			this.filteredItems = filteredItems;
			this.visibleItems = this.filteredItems.slice(0, Math.min(16, this.filteredItems.length));
			this.pushChanges();
			LocomotiveScrollService.update();
			// console.log('MaterialsComponent.filteredItems', filteredItems.length);
		});
	}

	showMore(event) {
		const pageSize = 32;
		if (this.visibleItems.length + pageSize >= this.filteredItems.length) {
			this.visibleItems = this.filteredItems.slice();
		} else {
			this.visibleItems = this.filteredItems.slice(0, Math.min(this.visibleItems.length + pageSize, this.filteredItems.length));
		}
		this.pushChanges();
		LocomotiveScrollService.update();
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

	onToggle(item) {
		this.selectedItem = this.selectedItem === item ? null : item;
		/*
		if (this.selectedItem) {
			const selector = '#cat-' + item.category.id + '-' + item.id;
			LocomotiveScrollService.scrollToSelector(selector);
		}
		*/
		this.pushChanges();
	}

	onOpenItem(item, items) {
		if (item.items) {
			const active = !item.active;
			this.filteredItems.forEach(item_ => {
				if (item_ !== item) {
					item_.active = false;
					const node = document.querySelector(`#material-${item_.id}`);
					if (node) {
						node.style.marginBottom = `0px`;
					}
				} else {
					item.active = active;
				}
			});
			if (active) {
				this.pushChanges();
			}
			const node = document.querySelector(`#material-${item.id}`);
			if (node) {
				const target = node.querySelector('.group--subitems');
				if (target) {
					const targetRect = target.getBoundingClientRect();
					const height = targetRect.height + 40;
					if (!active) {
						this.pushChanges();
					}
					const from = { pow: active ? 0 : 1 };
					gsap.to(from, {
						pow: active ? 1 : 0,
						duration: height / 5000,
						ease: Power2.easeOut,
						onUpdate: () => {
							node.style.marginBottom = `${from.pow * height}px`;
						},
						onComplete: () => {
							LocomotiveScrollService.scrollToSelector(`#material-${item.id} .group--subitems`);
						},
					});
				}
			}
		} else {
			ModalService.open$({ src: environment.template.modal.materialsModal, data: { item, items } }).pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => {
				console.log('MaterialComponent.onOpen', event);
				/*
				if (event instanceof ModalResolveEvent) {
					window.location.href = environment.slug.reservedArea;
				}
				*/
			});
		}
	}

	setCategory(category, event) {
		if (event) {
			event.preventDefault();
		}
		this.controls.category.value = category.value;
		setTimeout(() => {
			LocomotiveScrollService.update();
			LocomotiveScrollService.scrollToSelector('#category-' + category.value, { offset: -240 });
		}, 500);
	}

	clearFilter(event, filter) {
		event.preventDefault();
		event.stopImmediatePropagation();
		filter.clear();
		this.pushChanges();
	}
}

MaterialsComponent.meta = {
	selector: '[materials]',
};
