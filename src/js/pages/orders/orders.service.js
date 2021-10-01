import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class OrdersService {

	static all$() {
		if (environment.flags.production) {
			// !!! restituisce gli ordini effettuati dell'utente in sessione.
			return ApiService.get$('/orders/all');
		} else {
			return ApiService.get$('/orders/all.json');
		}
	}

	static detail$(orderId) {
		if (environment.flags.production) {
			// !!! restituisce il dettaglio dell'ordine dell'utente in sessione con id == orderId.
			return ApiService.get$(`/orders/detail/${orderId}`);
		} else {
			return ApiService.get$('/orders/detail.json');
		}
	}

}
