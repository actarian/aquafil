import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { IntersectionService } from '../intersection/intersection.service';

export class AppearDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		node.classList.add('appear');
	}

	onChanges() {
		if (!this.appeared) {
			this.appeared = true;
			const { node } = getContext(this);
			IntersectionService.intersection$(node).pipe(
				// first(),
				takeUntil(this.unsubscribe$),
			).subscribe(entry => {
				entry.intersectionRatio > 0.5 ? node.classList.add('appeared') : node.classList.remove('appeared');
			});
		}
	}

}

AppearDirective.meta = {
	selector: '[appear]',
};
