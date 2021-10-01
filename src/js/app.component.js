import { Component, getContext } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { ModalResolveEvent, ModalService } from './common/modal/modal.service';
import { ScrollService } from './common/scroll/scroll.service';
import { environment } from './environment';
import { CartService } from './pages/cart/cart.service';
import { CartMiniService } from './shared/cart-mini/cart-mini.service';
import { HeaderService } from './shared/header/header.service';
import { UserService } from './shared/user/user.service';

export class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		// console.log('AppComponent.onInit');

		ScrollService.init$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();

		this.header = HeaderService.currentHeader;
		HeaderService.header$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(header => {
			this.header = header;
			this.pushChanges();
		});
		CartMiniService.items$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(_ => this.pushChanges());
	}

	onOpenMarketAndLanguage() {
		HeaderService.onBack();
		ModalService.open$({ src: environment.template.modal.marketsAndLanguagesModal }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('AppComponent.onOpenMarketAndLanguage', event);
		});
	}

	onLogin() {
		HeaderService.onBack();
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 1 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('AppComponent.onLogin', event);
			if (event instanceof ModalResolveEvent) {
				window.location.href = environment.slug.reservedArea;
			}
		});
	}

	onLogout() {
		UserService.signout$().pipe(
			first(),
		).subscribe();
	}

	onProjectRegistration(event) {
		ModalService.open$({ src: environment.template.modal.projectsRegistrationModal }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('AppComponent.onProjectRegistration', event);
			/*
			if (event instanceof ModalResolveEvent) {
				// window.location.href = environment.slug.reservedArea;
			}
			*/
		});
	}

	onAddToCart(item) {
		// resetting purchase procedure
		CartService.setCart(null);
		// getting showefy price and adding to mini cart
		CartMiniService.getPriceAndAddItem$(item).pipe(
			first(),
		).subscribe(_ => {
			this.pushChanges();
		});
	}

	onOpenMiniCart() {
		HeaderService.setHeader('cart');
	}
}

AppComponent.meta = {
	selector: '[app-component]',
};
