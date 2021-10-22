import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

export class ScrollMenuDirective extends Directive {

	set index(index) {
		if (this.index_ !== index) {
			this.index_ = index;
			const anchors = this.anchors;
			anchors.forEach((x, i) => {
				index === i ? x.a.classList.add('active') : x.a.classList.remove('active');
			});
		}
	}

	onInit() {
		const { node } = getContext(this);
		const anchors = this.anchors = Array.prototype.slice.call(node.querySelectorAll('[href]'))
			.filter(x => x.hasAttribute('href')).map(x => {
				const href = x.getAttribute('href');
				const target = document.querySelector(href);
				return {
					a: x,
					href,
					target,
				};
			});
		// console.log(anchors);
		fromEvent(window, 'scroll').pipe(
			startWith(1),
			takeUntil(this.unsubscribe$),
		).subscribe(_ => {
			const tops = anchors.map((x, i) => {
				const rect = x.target.getBoundingClientRect();
				return {
					top: rect.top,
					index: i,
				};
			})
			tops.sort((a, b) => {
				return a.top - b.top;
			});
			const nearest = tops.reduce((p, c, i) => {
				const distance = Math.abs(c.top);
				return distance < p.distance ? { ...c, distance } : p;
			}, Object.assign({}, tops[0], { distance: Number.POSITIVE_INFINITY }));
			this.index = nearest.index;
		});
	}

}

ScrollMenuDirective.meta = {
	selector: `[scroll-menu]`
};
