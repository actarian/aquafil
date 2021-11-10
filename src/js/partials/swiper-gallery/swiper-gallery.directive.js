import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperGalleryDirective extends SwiperDirective {

	onInit() {
		console.log(this.initialSlide);
		this.options = {
			initialSlide: this.initialSlide,
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
				prevEl: '.btn--gallery-prev',
				nextEl: '.btn--gallery-next',
			},
		};
		this.init_();
		setTimeout(() => {
			this.swiper.slideTo(this.initialSlide, 0);
		}, 100);
		// console.log('SwiperContentDirective.onInit');
	}

}

SwiperGalleryDirective.meta = {
	selector: '[swiper-gallery]',
	inputs: ['items', 'initialSlide'],
};
