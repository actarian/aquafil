import { fromEvent, ReplaySubject } from 'rxjs';
import { delay, first, map, startWith, switchMap } from 'rxjs/operators';

export class ScrollService {

	static scroll$ = new ReplaySubject(1);
	static scroll(scroll) {
		// console.log('ScrollService.scroll', scroll);
		this.scroll$.next(scroll);
	}

	static init$(node) {
		let previousY = window.pageYOffset;
		const event = { direction: null, scroll: { x: 0, y: 0 }, speed: 0 };
		return fromEvent(window, 'DOMContentLoaded').pipe(
			// tap(_ => console.log('ScrollService.DOMContentLoaded')),
			first(),
			delay(1),
			switchMap(_ => fromEvent(window, 'scroll')),
			startWith(true),
			// tap(_ => console.log('ScrollService.scroll')),
			map(_ => {
				/*
				const body = document.querySelector('body');
				let previousY = body.scrollTop;
				body.addEventListener('scroll', () => {
					const y = body.scrollTop;
					const direction = y >= previousY ? 'down' : 'up';
					if (Math.abs(y - previousY) > 90) {
						// console.log('scroll', y, direction);
						previousY = y;
						event.direction = direction;
						event.scroll.y = y;
						ScrollService.scroll(event);
					}
				}, true);
				*/
				const y = window.pageYOffset;
				const direction = y >= previousY ? 'down' : 'up';
				// console.log(Math.abs(y - previousY) > 90);
				// if (Math.abs(y - previousY) > 90) {
				previousY = y;
				event.direction = direction;
				event.scroll.y = y;
				ScrollService.scroll(event);
				// }
				return event;
			}),
		);
	}

	static scrollTo(target, options = { offset: -130 }) {
		const body = document.querySelector('body');
		const currentTop = body.scrollTop; // window.pageYOffset; // body.scrollTop;
		const targetTop = currentTop + target.getBoundingClientRect().top + options.offset;
		const distance = targetTop - currentTop;
		const o = { pow: 0 };
		gsap.set(body, {
			'scroll-behavior': 'auto'
		});
		if (options.disableLerp) {
			gsap.set(body, {
				'scrollTop': currentTop + distance
			});
			gsap.set(body, {
				'scroll-behavior': 'smooth'
			});
		} else {
			gsap.to(o, {
				duration: Math.abs(distance) / 2000,
				pow: 1,
				ease: Quad.easeOut,
				overwrite: 'all',
				onUpdate: () => {
					gsap.set(body, {
						'scrollTop': currentTop + distance * o.pow
					});
					// window.scrollTo(0, currentTop + distance * o.pow);
				},
				onComplete: () => {
					gsap.set(body, {
						'scroll-behavior': 'smooth'
					});
				}
			});
		}
		// target.scrollIntoView();
	}

	static scrollToSelector(selector, options) {
		const target = document.querySelector(selector);
		if (target) {
			ScrollService.scrollTo(target, options);
		}
	}

}
