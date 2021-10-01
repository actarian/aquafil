import { Directive, getContext } from 'rxcomp';

export class SubmenuDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		const items = Array.prototype.slice.call(node.querySelectorAll('[data-picture]'));
		const target = node.querySelector('[data-target]');
		gsap.set(target, { opacity: 1 });
		items.forEach(item => {
			item.addEventListener('mouseover', (event) => {
				const picture = item.getAttribute('data-picture');
				gsap.set(target, { opacity: 0 });
				target.onload = () => {
					gsap.to(target, {
						duration: 0.5,
						delay: 0.1,
						opacity: 1,
						ease: Power4.easeOut,
						overwrite: 'all',
					});
				}
				target.src = picture;
			});
		});
	}

}

SubmenuDirective.meta = {
	selector: '[submenu]'
};
