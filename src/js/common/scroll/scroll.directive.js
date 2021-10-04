import { Directive, getContext } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import { ScrollService } from './scroll.service';

export class ScrollDirective extends Directive {

	onInit() {
		this.scroll$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(event => {
			// console.log('ScrollDirective', event);
		});
	}

	scroll$() {
		const { node } = getContext(this);
		const target = this.scroll && node.querySelector(this.scroll) || node;
		const container = target === node ? window : node;
		const speed = this.scrollSpeed ? parseFloat(this.scrollSpeed) : 1.5;
		return ScrollService.scroll$.pipe(
			tap(_ => {
				const containerRect = container === window ? { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight } : container.getBoundingClientRect();
				const wh = containerRect.height;
				const rect = target.getBoundingClientRect();
				const currentY = gsap.getProperty(target, 'y');
				const top = rect.top - currentY;
				const height = rect.height;
				const space = wh + height;
				let pow;
				if (top > -height && top < wh) {
					pow = (top + height) / space;
					pow = 1 - pow * 2;
					const y = pow * speed * -100;
					gsap.to(target, {
						y,
						duration: 0.250,
					});
				}
				/*
				const wh2 = wh / 2;
				const bottom = rect.bottom - currentY;
				if (top < wh && bottom > 0) {
					pow = (top - wh2) / wh2;
					const y = pow * speed * 40;
					gsap.set(node, { y });
				}
				*/
			}),
		);
	}

}

ScrollDirective.meta = {
	selector: '[scroll]',
	inputs: ['scroll', 'scrollSpeed'],
};
