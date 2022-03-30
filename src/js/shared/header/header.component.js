import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from '../../common/scroll/scroll.service';
import { MenuService } from '../menu/menu.service';
import { HeaderService } from './header.service';

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
		ScrollService.scroll$.pipe(
			takeUntil(this.unsubscribe$),
		).subscribe((event) => {
			this.direction = event.direction;
			this.scrolled = event.scroll.y > 100;
			// console.log('HeaderComponent', event.scroll.y, event.direction, event.speed);
		});
	}

	onToggle(id) {
		MenuService.onBack();
		HeaderService.toggleHeader(id);
	}

	onMenu(id) {
		const headerMenu = document.querySelector('.header__menu');
		if (headerMenu) {
			headerMenu.scrollTo(0, 0);
		}
		MenuService.setMenu(id);
	}

	onBack(event) {
		MenuService.onBack();
	}
}

HeaderComponent.meta = {
	selector: '[header]',
};
