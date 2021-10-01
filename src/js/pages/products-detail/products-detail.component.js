import { Component, getContext } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalResolveEvent, ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { CartMiniService } from '../../shared/cart-mini/cart-mini.service';
import { HeaderService } from '../../shared/header/header.service';
import { UserService } from '../../shared/user/user.service';
import { CartService } from '../cart/cart.service';
import { ProductsDetailService } from './products-detail.service';

export class ProductsDetailComponent extends Component {

	get firstConfigurableVersion() {
		return this.items && this.items.find(x => x.configurable);
	}

	onInit() {
		this.items = [];
		this.visibleItems = [];
		ProductsDetailService.versions$(this.product.id).pipe(
			first(),
		).subscribe(items => {
			this.items = items;
			this.visibleItems = this.items.slice(0, Math.min(4, this.items.length));
			this.pushChanges();
		});
	}

	isAddedToCart(item) {
		return CartMiniService.hasItem(item);
	}

	onAddToCart(item) {
		if (this.isAddedToCart(item)) {
			HeaderService.setHeader('cart');
		} else {
			// resetting purchase procedure
			CartService.setCart(null);
			// getting showefy price and adding to mini cart
			CartMiniService.getPriceAndAddItem$(item).pipe(
				first(),
			).subscribe(_ => {
				this.pushChanges();
			});
		}
	}

	scrollTo(id) {
		const { node } = getContext(this);
		const target = node.querySelector(id);
		if (target) {
			LocomotiveScrollService.scrollTo(target, { offset: -200 });
		}
	}

	showMore(event) {
		const pageSize = 12;
		if (this.visibleItems.length + pageSize >= this.items.length) {
			this.visibleItems = this.items.slice();
		} else {
			this.visibleItems = this.items.slice(0, Math.min(this.visibleItems.length + pageSize, this.items.length));
		}
		this.pushChanges();
		LocomotiveScrollService.update();
	}

	configureProduct(version) {
		version = version || this.firstConfigurableVersion;
		if (!version) {
			return;
		}
		if (environment.flags.production) {
			window.location.href = `${this.product.url}/config?productId=${version.productId}&code=${version.code}${version.familyCode ? `&familyCode=${version.familyCode}` : ''}`;
		} else {
			window.location.href = `${environment.slug.configureProduct}?productId=${version.productId}&code=${version.code}${version.familyCode ? `&familyCode=${version.familyCode}` : ''}`;
		}
	}

	onReservedArea() {
		UserService.me$().pipe(
			first(),
		).subscribe(user => {
			if (user) {
				window.location.href = environment.slug.reservedArea;
			} else {
				ModalService.open$({ src: environment.template.modal.userModal, data: { view: 1 } }).pipe(
					takeUntil(this.unsubscribe$),
				).subscribe(event => {
					console.log('ProductsDetailComponent.onLogin', event);
					if (event instanceof ModalResolveEvent) {
						window.location.href = environment.slug.reservedArea;
					}
				});
			}
		});
	}
}

ProductsDetailComponent.meta = {
	selector: '[products-detail]',
	inputs: ['product'],
};
