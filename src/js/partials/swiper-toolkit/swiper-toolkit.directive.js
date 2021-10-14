import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperToolkitDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 1,
			spaceBetween: 60,
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
		};
		this.init_();
		// console.log('SwiperToolkitDirective.onInit');
	}

}

SwiperToolkitDirective.meta = {
	selector: '[swiper-toolkit]'
};
