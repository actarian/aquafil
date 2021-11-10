import { Component, getContext } from 'rxcomp';
import { EMPTY, fromEvent, merge } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';

export class GalleryComponent extends Component {

	onInit() {
		// console.log(this.node.firstElementChild.outerHTML);
		const { node } = getContext(this);
		node.dataset.originalInnerHTML = node.innerHTML;
		this.click$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();
	}

	click$() {
		const { node } = getContext(this);
		return fromEvent(node, 'click').pipe(
			map(_ => {
				const currentSrc = node.getAttribute('gallery');
				const galleryItems = Array.prototype.slice.call(document.querySelectorAll('[gallery]')).filter(x => !x.parentNode.classList.contains('swiper-slide-duplicate')).map(x => {
					const src = x.getAttribute('gallery');
					// console.log('src', src);
					const originalInnerHTML = x.dataset.originalInnerHTML || x.innerHTML;
					// console.log('originalInnerHTML', originalInnerHTML)
					// const outerHTML = x.firstElementChild.outerHTML;
					const div = document.createElement('div');
					div.innerHTML = originalInnerHTML;
					const cloneNode = div.firstElementChild;
					// const cloneNode = Component.create(originalInnerHTML); //x.firstElementChild.cloneNode(true);
					// const iframes = Array.prototype.slice.call(cloneNode.querySelectorAll('iframe'));
					// iframes.forEach(x => x.parentNode.removeChild(x));
					// console.log(originalInnerHTML);
					const srcNode = this.setSrcNode(cloneNode, src);
					return {
						src: src,
						node: cloneNode,
						active: src === currentSrc,
					};
				});
				return galleryItems;
			}),
			tap(items => {
				this.addGallery(items);
			}),
		);
	}

	listeners$() {
		const close = this.close$();
		return merge(close, this.prev$(), this.next$(), this.events$()).pipe(
			takeUntil(close),
		);
	}

	addGallery(items) {
		console.log('clicked', items);
		const initialSlide = items.reduce((p, c, i) => {
			return c.active ? i : p;
		}, 0);
		ModalService.open$({ src: environment.template.modal.galleryModal, data: { items, initialSlide } }).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(event => {
			console.log('GalleryComponent.addGallery', event);
		});
	}

	close$() {
		const modalNode = this.modalNode;
		const button = modalNode.querySelector('.btn--close');
		const body = document.querySelector('body');
		return fromEvent(button, 'click').pipe(
			tap(_ => {
				// !!!
				Component.unregister(modalNode);
				// this.instances.forEach(x => x.destroy());
				body.removeChild(modalNode);
				// CursorService.clear();
				// this.instances = null;
				this.modalNode = null;
			}),
		);
	}

	prev$() {
		const modalNode = this.modalNode;
		const button = modalNode.querySelector('.btn--prev');
		return fromEvent(button, 'click').pipe(
			tap(_ => {
				const swiperInstance = this.swiperInstance;
				if (swiperInstance != null) {
					swiperInstance.slidePrev();
				}
			}),
		);
	}

	next$() {
		const modalNode = this.modalNode;
		const button = modalNode.querySelector('.btn--next');
		return fromEvent(button, 'click').pipe(
			tap(_ => {
				const swiperInstance = this.swiperInstance;
				if (swiperInstance != null) {
					swiperInstance.slideNext();
				}
			}),
		);
	}

	events$() {
		const indexNode = this.modalNode.querySelector('.modal-gallery__index');
		const swiperInstance = this.swiperInstance;
		if (swiperInstance != null) {
			return swiperInstance.events$.pipe(
				tap(index => {
					// console.log('index', index, swiperInstance);
					indexNode.innerHTML = `${index + 1} / ${swiperInstance.total}`;
				}),
			);
		} else {
			return EMPTY;
		}
	}

	getSrcNode(node) {
		if (node.getAttribute('src') != null) {
			return node;
		} else {
			return node.querySelector('[src]');
		}
	}

	setSrcNode(node, src) {
		const srcNode = this.getSrcNode(node);
		if (srcNode && srcNode.tagName.toLowerCase() === 'img') {
			srcNode.setAttribute('src', src);
		}
		return srcNode;
	}

	static meta = {
		selector: '[gallery]',
	};

}
