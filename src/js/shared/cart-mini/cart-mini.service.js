import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { LocalStorageService } from '../../common/storage/local-storage.service';
import { environment } from '../../environment';
import { HeaderService } from '../header/header.service';

export class CartMiniService {

	static get STORAGE_KEY() {
		return `cartItems_${environment.currentMarket}`;
	}

	static items$_ = new BehaviorSubject([]);

	static get currentItems() {
		return CartMiniService.items$_.getValue();
	}

	static get count() {
		return CartMiniService.currentItems.length;
	}

	static hasItem(item) {
		const items = CartMiniService.currentItems;
		const index = CartMiniService.indexOf(item, items);
		return index !== -1;
	}

	static setItems(items, skip) {
		if (items) {
			LocalStorageService.set(CartMiniService.STORAGE_KEY, items);
		} else {
			LocalStorageService.delete(CartMiniService.STORAGE_KEY);
		}
		if (!skip) {
			CartMiniService.items$_.next(items);
		}
	}

	static items$() {
		const localItems = LocalStorageService.get(CartMiniService.STORAGE_KEY) || [];
		return of(localItems).pipe(
			switchMap(items => {
				CartMiniService.setItems(items);
				return CartMiniService.items$_;
			})
		);
	}

	static incrementItem$(item) {
		return of(item).pipe(
			map(item => {
				const items = CartMiniService.currentItems.slice();
				const item_ = CartMiniService.find(item, items);
				if (item_) {
					item_.qty++;
					CartMiniService.setItems(items);
					return item_;
				} else {
					return null;
				}
			}),
		)
	}

	static decrementItem$(item) {
		return of(item).pipe(
			switchMap(item => {
				const items = CartMiniService.currentItems.slice();
				const item_ = CartMiniService.find(item, items);
				if (item_) {
					item_.qty--;
					if (item_.qty > 0) {
						CartMiniService.setItems(items);
						return of(item_);
					} else {
						return CartMiniService.removeItem$(item);
					}
				} else {
					return of(null);
				}
			}),
		)
	}

	static addItem$(item, qty = 1) {
		// const count = CartMiniService.count;
		return of(Object.assign({}, item, { qty })).pipe(
			map(item => {
				const items = CartMiniService.currentItems.slice();
				const item_ = CartMiniService.find(item, items);
				if (item_) {
					item_.qty += item.qty;
					item_.price = item.price;
					CartMiniService.setItems(items);
					return item_;
				} else {
					items.push(item);
					CartMiniService.setItems(items);
					return item;
				}
			}),
			tap(_ => {
				// if (count === 0) {
				HeaderService.setHeader('cart');
				// }
			}),
		)
	}

	static removeItem$(item) {
		return of(item).pipe(
			map(item => {
				const items = CartMiniService.currentItems.slice();
				const index = CartMiniService.indexOf(item, items);
				if (index !== -1) {
					items.splice(index, 1);
					if (items.length === 0) {
						HeaderService.onBack();
					}
					CartMiniService.setItems(items);
					return item;
				} else {
					return null;
				}
			}),
		)
	}

	static removeAll$() {
		return of([]).pipe(
			map(items => {
				HeaderService.onBack();
				CartMiniService.setItems(items);
				return items;
			}),
		)
	}

	static getPrice$(item) {
		if (environment.flags.production) {
			return ApiService.post$('/cart-mini/price', item);
		} else {
			return ApiService.get$('/cart-mini/price.json');
		}
	}

	static getPriceAndAddItem$(item, qty = 1) {
		return CartMiniService.getPrice$(item).pipe(
			switchMap(item => CartMiniService.addItem$(item, qty)),
		);
	}

	static match(item, item_) {
		return item_.id === item.id && item_.code === item.code && ((!item_.showefy && !item.showefy) || (item_.showefy && item.showefy && item_.showefy.internalstr === item.showefy.internalstr));
	}

	static find(item, items) {
		return items.find(item_ => CartMiniService.match(item, item_));
	}

	static indexOf(item, items) {
		return items.reduce((p, item_, i) => {
			return p !== -1 ? p : (CartMiniService.match(item, item_) ? i : p);
		}, -1);
	}
}
