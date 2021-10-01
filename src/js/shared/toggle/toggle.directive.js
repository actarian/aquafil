import { Directive, getContext } from 'rxcomp';

export class ToggleDirective extends Directive {

	toggle_ = false;
	get toggle() {
		return this.toggle_;
	}
	set toggle(toggle) {
		if (this.toggle_ !== toggle) {
			this.toggle_ = toggle;
			const { node } = getContext(this);
			if (node) {
				toggle ? node.classList.add('active') : node.classList.remove('active');
			}
		}
	}

	onInit() {
		this.onToggle = this.onToggle.bind(this);
		const { node } = getContext(this);
		this.toggle ? node.classList.add('active') : node.classList.remove('active');
		node.addEventListener('click', this.onToggle);
	}

	onDestroy() {
		const { node } = getContext(this);
		node.removeEventListener('click', this.onToggle);
	}

	onToggle(event) {
		event.preventDefault();
		event.stopPropagation();
		this.toggle = !this.toggle;
	}
}

ToggleDirective.meta = {
	selector: '[toggle]',
	inputs: ['toggle'],
};
