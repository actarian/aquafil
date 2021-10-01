import { Component } from 'rxcomp';
import { LocomotiveScrollService } from '../locomotive-scroll/locomotive-scroll.service';

export class FilterItemComponent extends Component {

	onInit() {

	}

	closeFilter() {
		this.filter.active = false;
		this.change.next();
		// this.pushChanges();
	}

	toggleFilter(filter) {
		Object.keys(this.filters).forEach(key => {
			const f = this.filters[key];
			if (f === filter) {
				f.active = !f.active;
			} else {
				f.active = false;
			}
		});
		this.change.next();
		// this.pushChanges();
	}

	clearFilter(event, filter) {
		event.preventDefault();
		event.stopImmediatePropagation();
		filter.clear();
		this.change.next();
		// this.pushChanges();
	}

	onEnter() {
		LocomotiveScrollService.stop();
	}

	onLeave() {
		LocomotiveScrollService.start();
	}
}

FilterItemComponent.meta = {
	selector: '[filter], [[filter]]',
	outputs: ['change'],
	inputs: ['filter', 'filters', 'name'],
	template: /* html */`
		<div class="group--filter" (click)="toggleFilter(filter)" (clickOutside)="closeFilter(filter)">
			<span class="label" [innerHTML]="filter.getLabel() || name"></span>
			<svg class="caret-down" *if="!filter.hasAny()"><use xlink:href="#caret-down"></use></svg>
			<svg class="close-sm" *if="filter.hasAny()" (click)="clearFilter($event, filter)"><use xlink:href="#close-sm"></use></svg>
		</div>
		<div class="options" *if="filter.active" (mouseenter)="onEnter()" (mouseleave)="onLeave()">
			<div class="category" [innerHTML]="name"></div>
			<ul class="nav--options">
				<li class="nav--options__item" [class]="{ active: filter.has(item), disabled: item.disabled, empty: !item.value }" *for="let item of filter.options">
					<span class="option" (click)="filter.set(item)">
						<span class="name" [innerHTML]="item.label | label"></span>
						<!-- <span class="count" [innerHTML]="item.count || ''"></span> -->
					</span>
				</li>
			</ul>
		</div>
		`,
};
