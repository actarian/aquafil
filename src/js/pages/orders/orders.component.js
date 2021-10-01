import { Component } from 'rxcomp';
import { first, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { OrdersService } from './orders.service';

export class OrdersComponent extends Component {

	onInit() {
		this.orders = [];
		this.load$().pipe(
			first(),
		).subscribe();
	}

	load$() {
		return OrdersService.all$().pipe(
			tap(orders => {
				this.orders = orders;
				this.pushChanges();
			})
		);
	}

	onOpenOrder(order) {
		ModalService.open$({ src: environment.template.modal.ordersModal, data: { orderId: order.id } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('OrdersComponent.onOpenOrder', event);
		});
	}
}

OrdersComponent.meta = {
	selector: '[orders]',
};
