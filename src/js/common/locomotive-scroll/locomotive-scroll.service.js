import { fromEvent, ReplaySubject } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

export class LocomotiveScrollService {

	static scroll$ = new ReplaySubject(1);
	static scroll(scroll) {
		// console.log('LocomotiveScrollService.scroll', scroll);
		this.scroll$.next(scroll);
	}

	static init(node, options) {
		options = Object.assign({
			useKeyboard: true,
			smoothMobile: true,
			inertia: 0.5,
			// name:'scroll',
			// offset: [0,0], // bottom top
			// repeat: false,
			smooth: true,
			// initPosition: { x: 0, y: 0 }
			// direction: 'vertical',
			lerp: 0.01,
			getDirection: true, // add direction to scroll event
			getSpeed: true, // add speed to scroll event
			// class: 'is-inview',
			initClass: 'has-scroll-init',
			scrollingClass: 'has-scroll-scrolling',
			draggingClass: 'has-scroll-dragging',
			smoothClass: 'has-scroll-smooth',
			scrollbarContainer: false,
			scrollbarClass: 'c-scrollbar',
			multiplier: 1,
			firefoxMultiplier: 50,
			touchMultiplier: 2,
			scrollFromAnywhere: true,
			gestureDirection: 'vertical',
			reloadOnContextChange: false,
			resetNativeScroll: true,
		}, options, {
			el: node,
		});
		if (this.useLocomotiveScroll()) {
			const instance = new LocomotiveScroll(options);
			LocomotiveScrollService.instance = instance;
			return instance;
		} else {
			document.querySelector('html').classList.add('has-scroll-init');
		}
	}

	static useLocomotiveScroll() {
		return window.innerWidth >= 768 && !this.isTouchDevice();
	}

	static isTouchDevice() {
		const userAgent = navigator.userAgent.toLowerCase();
		const isTablet = /(mac|ipad|tablet|(android(?!.*mobile))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
		const isSmartphone = /(ipod|iphone|(android(?!.*mobile))|(windows(?!.*phone)(.*touch)))/.test(userAgent);
		return isTablet || isSmartphone;
	}

	static isMacLike() {
		const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
		return isMacLike;
	}

	static isIOS() {
		const isIOS = /(iPhone|iPod|iPad)/i.test(navigator.platform);
		return isIOS;
	}

	static isMacOs() {
		const isMacOs = navigator.platform.toLowerCase().indexOf('mac') >= 0;
		return isMacOs;
	}

	static isSafari() {
		const isSafari = navigator.vendor.match(/apple/i) &&
			!navigator.userAgent.match(/crios/i) &&
			!navigator.userAgent.match(/fxios/i);
		return isSafari;
	}

	static init$(node) {
		return fromEvent(window, 'DOMContentLoaded').pipe(
			delay(1),
			switchMap(_ => {
				// setTimeout(() => {
				const instance = LocomotiveScrollService.init(node);
				if (instance) {
					const showefy = document.querySelector('#showefy');
					instance.on('scroll', instance => {
						LocomotiveScrollService.scroll(instance);
						if (showefy) {
							const isShowefyDisabled = instance.speed > 0.1;
							if (isShowefyDisabled) {
								if (showefy.style.pointerEvents !== 'none') {
									showefy.style.pointerEvents = 'none';
								}
							} else {
								if (showefy.style.pointerEvents === 'none') {
									showefy.style.pointerEvents = 'auto';
								}
							}
						}
					});
				} else {
					const event = { direction: null, scroll: { x: 0, y: 0 }, speed: 0 };
					const body = document.querySelector('body');
					let previousY = body.scrollTop; // window.pageYOffset; // body.scrollTop;
					body.addEventListener('scroll', () => {
						const y = body.scrollTop; // window.pageYOffset; // body.scrollTop;
						const direction = y >= previousY ? 'down' : 'up';
						if (Math.abs(y - previousY) > 90) {
							// console.log('scroll', y, direction);
							previousY = y;
							event.direction = direction;
							event.scroll.y = y;
							LocomotiveScrollService.scroll(event);
						}
					}, true);
				}
				return LocomotiveScrollService.scroll$;
				// }, 1);
			})
		);
	}

	static update() {
		if (this.instance) {
			this.instance.update();
		}
	}

	static stop() {
		if (this.instance) {
			this.instance.stop();
		}
	}

	static start() {
		if (this.instance) {
			this.instance.start();
		}
	}

	static scrollTo(target, options = { offset: -130 }) {
		if (this.instance) {
			this.instance.scrollTo(target, options);
		} else {
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
	}

	static scrollToSelector(selector, options) {
		const target = document.querySelector(selector);
		if (target) {
			LocomotiveScrollService.scrollTo(target, options);
		}
	}

}
