import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LocomotiveScrollService } from './locomotive-scroll.service';

export class LocomotiveScrollToDirective extends Directive {

	onInit() {
		this.initialFocus = false;
		const { module, node } = getContext(this);
		const expression = this.expression = node.getAttribute(`(locomotiveScrollTo)`);
		this.outputFunction = module.makeFunction(expression, ['$event']);
		this.scrollTo$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
	}

	scrollTo$() {
		const { module, node, parentInstance } = getContext(this);
		return fromEvent(node, 'click').pipe(
			tap(event => {
				if (event) {
					event.preventDefault();
				}
				const selector = module.resolve(this.outputFunction, parentInstance, event);
				if (typeof selector === 'string') {
					const target = node.querySelector(selector) || document.querySelector(selector);
					if (target) {
						const offset = this.offset;
						const options = offset ? { offset } : undefined;
						LocomotiveScrollService.scrollTo(target, options);
					}
				}
			}),
		);
	}

}

LocomotiveScrollToDirective.meta = {
	selector: `[(locomotiveScrollTo)]`,
	inputs: ['offset']
};
