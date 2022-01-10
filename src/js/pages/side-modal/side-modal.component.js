import { Component, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';

export class SideModalComponent extends Component {

	onInit() {
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			if (data.target) {
				const { node, module } = getContext(this);
				const content = node.querySelector('.side-modal__content');
				content.appendChild(data.target);
				const instances = this.instances = module.compile(content);
				// console.log('SideModalComponent.onInit', instances);
			}
			// console.log('SideModalComponent.onInit', data);
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
			startWith(_ => null),
			tap(_ => {
				node.style.top = `${header.offsetHeight}px`;
			})
		);
	}

	onClose() {
		ModalService.reject();
	}
}

SideModalComponent.meta = {
	selector: '[side-modal]'
};
