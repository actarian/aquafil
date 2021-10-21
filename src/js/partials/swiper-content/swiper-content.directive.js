import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperContentDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 1,
			spaceBetween: 80,
			speed: 600,
			keyboardControl: true,
			mousewheelControl: false,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			navigation: {
				prevEl: '.btn--prev',
				nextEl: '.btn--next',
			},
		};
		this.init_();
		// console.log('SwiperContentDirective.onInit');
	}

}

SwiperContentDirective.meta = {
	selector: '[swiper-content]'
};
