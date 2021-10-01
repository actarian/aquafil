import { getContext } from 'rxcomp';
import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperGalleryDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 'auto',
			spaceBetween: 40,
			speed: 600,
			centeredSlides: true,
			/*
			loop: true,
			loopAdditionalSlides: 100,
			*/
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
		const target = node.classList.contains('swiper-container') ? node : node.querySelector('.swiper-container');
		this.init_(target);
		// console.log('SwiperGalleryDirective.onInit');
	}

}

SwiperGalleryDirective.meta = {
	selector: '[swiper-gallery]'
};
