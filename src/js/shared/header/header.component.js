import { Component, getContext } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { ModalResolveEvent, ModalService } from '../../common/modal/modal.service';
import { ScrollService } from '../../common/scroll/scroll.service';
import { environment } from '../../environment';
import { CartMiniService } from '../cart-mini/cart-mini.service';
import { MenuService } from '../menu/menu.service';
import { UserService } from '../user/user.service';
import { HeaderService } from './header.service';

const USE_MODAL = false;

export class HeaderComponent extends Component {

	direction_ = null;
	get direction() {
		return this.direction_;
	}
	set direction(direction) {
		if (this.direction_ !== direction) {
			const { node } = getContext(this);
			node.classList.remove(`scrolling-${this.direction_}`);
			node.classList.add(`scrolling-${direction}`);
			this.direction_ = direction;
		}
	}

	scrolled_ = null;
	get scrolled() {
		return this.scrolled_;
	}
	set scrolled(scrolled) {
		if (this.scrolled_ !== scrolled) {
			this.scrolled_ = scrolled;
			const { node } = getContext(this);
			scrolled ? node.classList.add(`scrolled`) : node.classList.remove(`scrolled`);
		}
	}

	onInit() {
		const body = document.querySelector('body');
		this.header = HeaderService.currentHeader;
		HeaderService.header$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(header => {
			this.header = header;
			this.pushChanges();
			body.setAttribute('class', header !== -1 ? `${header}-active` : '');
		});
		this.menu = MenuService.currentMenu;
		MenuService.menu$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(menu => {
			this.menu = menu;
			this.pushChanges();
		});
		this.cart = CartMiniService;
		this.user = null;
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(user => {
			this.user = user;
			this.pushChanges();
		});
		const pictogram = document.querySelector('.page > .pictogram');
		ScrollService.scroll$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe((event) => {
			this.direction = event.direction;
			this.scrolled = event.scroll.y > 100;
			const opacity = 0.1 - 0.1 * Math.min(1, Math.max(0, (event.scroll.y - window.innerHeight * 3) / window.innerHeight / 3));
			if (pictogram) {
				gsap.set(pictogram, { opacity });
			}
			// console.log('HeaderComponent', event.scroll.y, event.direction, event.speed);
		});
	}

	onOpenMarketAndLanguage() {
		MenuService.onBack();
		HeaderService.onBack();
		ModalService.open$({ src: environment.template.modal.marketsAndLanguagesModal }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('HeaderComponent.onOpenMarketAndLanguage', event);
		});
	}

	onLogin() {
		MenuService.onBack();
		HeaderService.onBack();
		if (USE_MODAL) {
			ModalService.open$({ src: environment.template.modal.userModal, data: { view: 1 } }).pipe(
				takeUntil(this.unsubscribe$)
			).subscribe(event => {
				console.log('HeaderComponent.onLogin', event);
				if (event instanceof ModalResolveEvent) {
					window.location.href = environment.slug.reservedArea;
				}
			});
		} else {
			window.location.href = environment.slug.reservedArea;
		}
	}

	onLogout() {
		UserService.signout$().pipe(
			first(),
		).subscribe();
	}

	onToggle(id) {
		MenuService.onBack();
		HeaderService.toggleHeader(id);
	}

	onBack(event) {
		MenuService.onBack();
	}
}

HeaderComponent.meta = {
	selector: '[header]',
};
