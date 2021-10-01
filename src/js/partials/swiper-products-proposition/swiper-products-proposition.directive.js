import { getContext } from 'rxcomp';
import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperProductsPropositionDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 'auto',
			// slidesPerView: 1.5,
			spaceBetween: 30,
			breakpoints: {
				768: {
					slidesPerView: 'auto',
					spaceBetween: 40,
				},
				1024: {
					slidesPerView: 'auto',
					spaceBetween: 50
				},
				1440: {
					slidesPerView: 'auto',
					spaceBetween: 60
				},
				1920: {
					slidesPerView: 'auto',
					spaceBetween: 70
				}
			},
			/*
			slidesPerView: 1.5,
			spaceBetween: 30,
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 40
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 50
				},
				1440: {
					slidesPerView: 3,
					spaceBetween: 60
				},
				1920: {
					slidesPerView: 3,
					spaceBetween: 70
				}
			},
			*/
			speed: 600,
			centeredSlides: false,
			loop: false,
			loopAdditionalSlides: 100,
			keyboardControl: true,
			mousewheelControl: false,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		};
		const { node } = getContext(this);
		const target = node.querySelector('.swiper-container');
		this.init_(target);
		// console.log('SwiperProductsPropositionDirective.onInit');
	}

}

SwiperProductsPropositionDirective.meta = {
	selector: '[swiper-products-proposition]'
};
