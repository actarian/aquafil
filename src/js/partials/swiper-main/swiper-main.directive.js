import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperMainDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 1,
			spaceBetween: 0,
			speed: 600,
			autoplay: {
				delay: 5000,
			},
			keyboardControl: true,
			mousewheelControl: false,
			keyboard: {
				enabled: true,
				onlyInViewport: true,
			},
			pagination: {
				el: '.main-hero__bullets',
				clickable: true,
			},
			navigation: {
				prevEl: '.btn--up',
				nextEl: '.btn--down',
			},
		};
		this.init_();
		// console.log('SwiperMainDirective.onInit');
	}

}

SwiperMainDirective.meta = {
	selector: '[swiper-main]'
};
