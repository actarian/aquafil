import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { LocomotiveScrollService } from './locomotive-scroll.service';

export class LocomotiveScrollDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		LocomotiveScrollService.init$(node).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(event => {
			// console.log('LocomotiveScrollDirective', event);
		});
		if ('ResizeObserver' in window) {
			const resizeObserver = new ResizeObserver(entries => {
				// console.log('LocomotiveScrollDirective.ResizeObserver', entries[0].target.clientHeight);
				LocomotiveScrollService.update();
			});
			resizeObserver.observe(node);
		}
		/*
		const images = Array.prototype.slice.call(document.querySelectorAll('img'));
		images.forEach(image => {
			image.onload = () => {
				console.log(update);
				instance.update();
			};
		});
		*/
		/*
		window.onload = () => {
			setTimeout(() => {
				const instance = LocomotiveScrollService.init(node);
				if (instance) {
					instance.on('scroll', instance => {
						LocomotiveScrollService.scroll(instance.scroll.y);
					});
				} else {
					const body = document.querySelector('body');
					window.addEventListener('scroll', () => {
						const y = body.scrollTop; // window.pageYOffset
						LocomotiveScrollService.scroll(y);
					}, true);
				}
			}, 1);
		};
		*/
	}

}

LocomotiveScrollDirective.meta = {
	selector: '[locomotive-scroll],[[locomotive-scroll]]'
};
