import { Component, getContext } from 'rxcomp';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';

export class OrdersModalComponent extends Component {

	onInit() {
		super.onInit();
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			this.orderId = data.orderId;
			// console.log('OrdersModalComponent.onInit', data);
		}
		LocomotiveScrollService.stop();
	}

	onClose() {
		ModalService.reject();
	}

	onDestroy() {
		LocomotiveScrollService.start();
	}
}

OrdersModalComponent.meta = {
	selector: '[orders-modal]'
};
