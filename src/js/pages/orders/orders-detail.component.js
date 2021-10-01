import { Component, getContext } from 'rxcomp';
import { finalize, first, tap } from 'rxjs/operators';
import { LocationService } from '../../common/location/location.service';
import { OrdersModalComponent } from './orders-modal.component';
import { OrdersService } from './orders.service';

export class OrdersDetailComponent extends Component {

	onInit() {
		super.onInit();
		this.busy = false;
		this.order = null;
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof OrdersModalComponent) {
			this.orderId = parentInstance.orderId;
		} else {
			this.orderId = LocationService.get('orderId');
		}
		if (this.orderId) {
			this.load$().pipe(
				first(),
			).subscribe();
			// console.log('OrdersDetailComponent.onInit', data);
		} else {
			console.error('OrdersDetailComponent missing orderId');
		}
		console.log(this);
	}

	load$() {
		this.busy = true;
		return OrdersService.detail$(this.orderId).pipe(
			tap(order => {
				this.order = order;
			}),
			finalize(_ => {
				this.busy = false;
				this.pushChanges();
			}),
		);
	}
}

OrdersDetailComponent.meta = {
	selector: '[orders-detail]',
};
