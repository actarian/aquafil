import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { of } from 'rxjs';
import { auditTime, delay, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import { SearchService } from './search.service';

export class SearchComponent extends Component {

	onInit() {
		this.busy = false;
		this.items = [];
		this.visibleItems = [];
		const form = this.form = new FormGroup({
			search: new FormControl(null, [Validators.RequiredValidator()]),
		});
		const controls = this.controls = form.controls;
		this.search$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe((items) => {
			this.items = items;
			this.visibleItems = items.slice(0, Math.min(10, items.length));
			this.busy = false;
			this.pushChanges();
		});
	}

	search$() {
		return this.form.changes$.pipe(
			auditTime(500),
			map(changes => changes.search),
			distinctUntilChanged(),
			switchMap(query => {
				if (query != null && query.length > 1) {
					this.busy = true;
					this.pushChanges();
					return SearchService.search$(query).pipe(
						delay(2000),
					);
				} else {
					return of([]);
				}
			}),
		);
	}

}

SearchComponent.meta = {
	selector: '[search]',
};
