import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { environment } from '../../environment';
import { CartMiniService } from '../../shared/cart-mini/cart-mini.service';

export const CartSteps = {
	None: 0,
	Items: 1,
	Data: 2,
	Delivery: 3,
	Recap: 4,
	Payment: 5,
	Complete: 6,
	Error: -1,
};

/*
export class Cart {
	constructor() {
		this.step = CartSteps.Items; // number
		this.items = []; // CartItem[]
		this.shipmentCountry = null; // number
		this.user = null; // User
		this.guest = null; // boolean
		this.data = {
			firstName: null, // string
			lastName: null, // string
			email: null, // string
			telephone: null, // string
			address: null, // string
			zipCode: null, // string
			city: null, // string
			province: null, // string
			country: null, // number
			message: null, // string
			invoice: null, // boolean
			invoiceData: {
				taxNumber: null, // string
				sdi: null, // string
				pec: null, // string
			},
			billing: null, // boolean
			billingData: {
				company: null, // string
				firstName: null, // string
				lastName: null, // string
				telephone: null, // string
				address: null, // string
				zipCode: null, // string
				city: null, // string
				province: null, // string
				country: null, // number
			},
			conditions: false, // boolean
			privacy: false, // boolean
			terms: false, // boolean
		};
		this.deliveryData = null; // {
			firstName: null, // string
			lastName: null, // string
			email: null, // string
			telephone: null, // string
			address: null, // string
			zipCode: null, // string
			city: null, // string
			province: null, // string
			country: null, // { id: number, name: string }
		}
		this.billingData = null; // {
			firstName: null, // string
			lastName: null, // string
			address: null, // string
			zipCode: null, // string
			city: null, // string
			province: null, // string
			country: null, // { id: number, name: string }
		}
		this.deliveryType = null; // number
		this.delivery = null; // { id: number, name: string }
		this.discountCode = null; // string
		this.discount = null; // { code: string, price: number }
		this.paymentMethod = null; // number
		this.store = null; // Store
	}
}
*/

export class CartService {

	static get STORAGE_KEY() {
		return `cart_${environment.currentMarket}`;
	}

	static cart$_ = new BehaviorSubject(null);

	static get currentCart() {
		return CartService.cart$_.getValue();
	}

	static setStep(step) {
		const cart = CartService.currentCart;
		if (cart) {
			cart.step = step;
			CartService.setCart(cart);
		}
	}

	static setCart(cart, skip) {
		if (cart) {
			LocalStorageService.set(CartService.STORAGE_KEY, cart);
		} else {
			LocalStorageService.delete(CartService.STORAGE_KEY);
		}
		if (!skip) {
			CartService.cart$_.next(cart);
		}
	}

	static cart$() {
		const localCart = LocalStorageService.get(CartService.STORAGE_KEY) || null;
		return of(localCart).pipe(
			switchMap(cart => {
				CartService.setCart(cart);
				return CartService.cart$_;
			})
		);
	}

	static clear$() {
		return of(null).pipe(
			map(cart => {
				CartMiniService.setItems([]);
				CartService.setCart(cart);
				return cart;
			}),
		)
	}

	static data$() {
		if (environment.flags.production) {
			return ApiService.get$('/cart/data');
		} else {
			return ApiService.get$('/cart/data.json');
		}
	}

	static estimatedDelivery$(cart) {
		if (environment.flags.production) {
			return ApiService.post$('/cart/estimated-delivery', cart);
		} else {
			return ApiService.get$('/cart/estimated-delivery.json');
		}
	}

	static getDeliveryType$(cart) {
		if (environment.flags.production) {
			return ApiService.post$('/cart/delivery-type', cart);
		} else {
			return ApiService.get$('/cart/delivery-type.json');
		}
	}

	static getStores$(cart) {
		if (environment.flags.production) {
			return ApiService.post$('/cart/stores', cart);
		} else {
			return ApiService.get$('/cart/stores.json');
		}
	}

	static getDiscount$(payload) {
		if (environment.flags.production) {
			return ApiService.post$('/cart/discount', payload);
		} else {
			return ApiService.get$('/cart/discount.json');
		}
	}

	static doPayment$(cart) {
		return (environment.flags.production ? ApiService.post$('/cart/payment', cart) : ApiService.get$('/cart/payment.json')).pipe(
			tap(_ => {
				// !!! clearing cart with skip option!
				CartMiniService.setItems([], true);
				CartService.setCart(cart, true);
			}),
		)
	}
}
