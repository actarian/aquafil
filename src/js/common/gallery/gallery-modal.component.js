import { Component, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { ModalOutletComponent } from '../modal/modal-outlet.component';
import { ModalService } from '../modal/modal.service';

export class GalleryModalComponent extends Component {

	onInit() {
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			const items = this.items = data.items;
			items.forEach(item => {
				item.isImg = this.isImg(item);
				item.isVideo = this.isVideo(item);
			});
			const initialSlide = this.initialSlide = data.initialSlide;
			console.log(items, initialSlide);
			/*
			if (data.target) {
				const { node, module } = getContext(this);
				const content = node.querySelector('.side-modal__content');
				content.appendChild(data.target);
				const instances = this.instances = module.compile(content);
				console.log('GalleryModalComponent.onInit', instances);
			}
			*/
			console.log('GalleryModalComponent.onInit', data);
		}
		/*
		this.resize$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();
		*/
	}

	resize$() {
		const { node } = getContext(this);
		const header = document.querySelector('header');
		return fromEvent(window, 'resize').pipe(
			startWith(true),
			tap(_ => {
				node.style.top = `${header.offsetHeight}px`;
			})
		);
	}

	onClose() {
		ModalService.reject();
	}

	isImg(item) {
		const src = item.src.split('?')[0];
		const lastIndex = src.lastIndexOf('.');
		if (lastIndex !== -1) {
			const ext = src.substring(lastIndex + 1, src.length);
			return ['jpg', 'jpeg', 'png', 'gif'].indexOf(ext) !== -1
		} else {
			return false;
		}
	}

	isVideo(item) {
		const src = item.src.split('?')[0];
		const lastIndex = src.lastIndexOf('.');
		if (lastIndex !== -1) {
			const ext = src.substring(lastIndex + 1, src.length);
			return ['mp4', 'webm'].indexOf(ext) !== -1
		} else {
			return false;
		}
	}
}

GalleryModalComponent.meta = {
	selector: '[gallery-modal]'
};
