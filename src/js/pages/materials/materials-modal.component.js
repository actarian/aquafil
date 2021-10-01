import { Component, getContext } from 'rxcomp';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';

export class MaterialsModalComponent extends Component {

	onInit() {
		super.onInit();
		this.item = null;
		this.items = null;
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			this.item = data.item;
			this.items = data.items;
			// console.log('MaterialsModalComponent.onInit', data);
		}
		LocomotiveScrollService.stop();
	}

	hasPrev() {
		return true;
	}

	hasNext() {
		return true;
	}

	onPrev() {
		let index = this.items.indexOf(this.item);
		index--;
		if (index < 0) {
			index = this.items.length - 1;
		}
		this.item = this.items[index];
		this.pushChanges();
	}

	onNext() {
		let index = this.items.indexOf(this.item);
		index++;
		if (index === this.items.length) {
			index = 0;
		}
		this.item = this.items[index];
		this.pushChanges();
	}

	onClose() {
		ModalService.reject();
	}

	onDestroy() {
		LocomotiveScrollService.start();
	}
}

MaterialsModalComponent.meta = {
	selector: '[materials-modal]'
};
