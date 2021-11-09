import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export class ToggleDirective extends Directive {
	onInit() {
		const { node } = getContext(this);
		fromEvent(node, 'click').pipe(
			tap(_ => {
				const items = Array.prototype.slice.call(document.querySelectorAll(this.toggle));
				items.forEach(item => {
					if (item === node) {
						item.classList.contains('active') ? item.classList.remove('active') : item.classList.add('active');
					} else {
						item.classList.remove('active');
					}
				});
			}),
			takeUntil(this.unsubscribe$),
		).subscribe();
	}
}

ToggleDirective.meta = {
	selector: '[toggle]',
	inputs: ['toggle'],
};
