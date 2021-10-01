import { Directive, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { HeaderService } from '../header/header.service';
import { MenuService } from './menu.service';

export class MenuDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		const target = this.target = document.querySelector(`#menu-${this.menu}`);
		const preview = target.querySelector('[data-target]');
		const previewSrc = this.previewSrc = preview.src;
		const container = this.container = target.querySelector(`.container`);
		this.onClick = this.onClick.bind(this);
		this.onLeave = this.onLeave.bind(this);
		node.addEventListener('click', this.onClick);
		MenuService.menu$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(menu_ => {
			if (this.menu === menu_) {
				this.onEnter();
			} else {
				this.onExit();
			}
		});
	}

	onClick(event) {
		event.preventDefault();
		// console.log('MenuDirective.onClick', this.menu);
		if (HeaderService.currentHeader !== 'menu') {
			HeaderService.onBack();
		}
		MenuService.toggleMenu(this.menu);
	}

	onLeave() {
		// console.log('MenuDirective.onLeave', this.menu);
		MenuService.onBack();
		this.onExit();
	}

	onEnter() {
		// console.log('MenuDirective.onEnter', this.menu);
		const target = this.target;
		const preview = target.querySelector('[data-target]');
		preview.src = this.previewSrc;
		const container = this.container;
		container.addEventListener('mouseleave', this.onLeave);
	}

	onExit() {
		// console.log('MenuDirective.onExit', this.menu);
		const container = this.container;
		container.removeEventListener('mouseleave', this.onLeave);
	}

	onDestroy() {
		this.onExit();
		const { node } = getContext(this);
		node.removeEventListener('click', this.onClick);
	}
}

MenuDirective.meta = {
	selector: '[menu]',
	inputs: ['menu'],
};
