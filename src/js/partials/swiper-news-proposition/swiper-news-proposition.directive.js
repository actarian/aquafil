import { getContext } from 'rxcomp';
import { SwiperDirective } from '../../common/swiper/swiper.directive';

export class SwiperNewsPropositionDirective extends SwiperDirective {

	onInit() {
		this.options = {
			slidesPerView: 1,
			spaceBetween: 30,
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 40
				},
				1024: {
					slidesPerView: 2,
					spaceBetween: 50
				},
				1440: {
					slidesPerView: 2,
					spaceBetween: 60
				},
				1920: {
					slidesPerView: 2,
					spaceBetween: 70
				}
			},
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
		// console.log('SwiperNewsPropositionDirective.onInit');
	}

}

SwiperNewsPropositionDirective.meta = {
	selector: '[swiper-news-proposition]'
};
