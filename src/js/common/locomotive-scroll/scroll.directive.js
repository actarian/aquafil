import { Directive, getContext } from 'rxcomp';
import { takeUntil, tap } from 'rxjs/operators';
import { LocomotiveScrollService } from './locomotive-scroll.service';

export class ScrollDirective extends Directive {

	onInit() {
		if (LocomotiveScrollService.useLocomotiveScroll()) {
			this.scroll$().pipe(
				takeUntil(this.unsubscribe$),
			).subscribe(event => {
				// console.log('ScrollDirective', event);
			});
		}
	}

	scroll$() {
		const { node } = getContext(this);
		const speed = this.scrollSpeed ? parseFloat(this.scrollSpeed) : 1.5;
		return LocomotiveScrollService.scroll$.pipe(
			tap(scroll => {
				const wh = window.innerHeight;
				const rect = node.getBoundingClientRect();
				const currentY = gsap.getProperty(node, 'y');
				const top = rect.top - currentY;
				const height = rect.height;
				const space = wh + height;
				let pow;
				if (top > -height && top < wh) {
					pow = (top + height) / space;
					pow = 1 - pow * 2;
					const y = pow * speed * -100;
					gsap.set(node, { y });
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
	inputs: ['scrollSpeed'],
};
