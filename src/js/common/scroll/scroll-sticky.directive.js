import { Directive, getContext } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import { ScrollService } from './scroll.service';

export class ScrollStickyDirective extends Directive {

	sticked_ = false;
	get sticked() {
		return this.sticked_;
	}
	set sticked(sticked) {
		if (this.sticked_ !== sticked) {
			this.sticked_ = sticked;
			if (this.targetNode) {
				sticked ? this.targetNode.classList.add('sticked') : this.targetNode.classList.remove('sticked');
			}
		}
	}

	onInit() {
		const { node } = getContext(this);
		this.targetNode = (this.target ? (node.querySelector(this.target) || node) : node);
		this.until = this.until ? document.querySelector(this.until) : null;
		console.log('ScrollStickyDirective', this.targetNode, this.until);
		this.sticky$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(event => {
			// console.log('ScrollStickyDirective', event);
		});
	}

	sticky$() {
		const { node } = getContext(this);
		const targetNode = this.targetNode;
		const until = this.until;
		return ScrollService.scroll$.pipe(
			tap(event => {
				console.log(event);
				const rect = node.getBoundingClientRect();
				let y = 0;
				if (this.bottom) {
					const bottom = window.innerHeight - targetNode.offsetHeight;
					if (window.innerWidth >= 1024 && rect.y > bottom) {
						y = bottom - rect.y;
						this.sticked = true;
					} else {
						this.sticked = false;
					}
				} else {
					const top = event.direction === 'down' ? 80 : 135;
					if (window.innerWidth >= 1024 && rect.y < top) {
						y = top - rect.y;
						if (until) {
							const untilRect = until.getBoundingClientRect();
							const height = untilRect.y - rect.y;
							y = Math.min(height, y);
						}
						this.sticked = true;
					} else {
						this.sticked = false;
					}
				}
				console.log(rect.height - targetNode.offsetHeight);
				// gsap.set(targetNode, { y });
			}),
		);
	}

}

ScrollStickyDirective.meta = {
	selector: '[scroll-sticky],[[scroll-sticky]]',
	inputs: ['target', 'until', 'bottom'],
};
