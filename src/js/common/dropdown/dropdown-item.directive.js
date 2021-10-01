import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { LocomotiveScrollService } from '../locomotive-scroll/locomotive-scroll.service';
import { DropdownDirective } from './dropdown.directive';

export class DropdownItemDirective extends Directive {

	get id() {
		return this['dropdown-item'];
	}

	onInit() {
		const { node } = getContext(this);
		node.classList.add('dropdown-item');
		DropdownDirective.dropdown$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(id => {
			// console.log('DropdownItemDirective', id, this['dropdown-item']);
			if (this.id === id) {
				node.classList.add('dropped');
				// LocomotiveScrollService.stop();
			} else {
				node.classList.remove('dropped');
				// LocomotiveScrollService.start();
			}
		});
		this.enter$(node).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
		this.leave$(node).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe();
		// this.addListeners();
	}

	enter$(node) {
		// const { node } = getContext(this);
		return fromEvent(node, 'mouseenter').pipe(
			tap(event => {
				LocomotiveScrollService.stop();
			}),
		);
	}

	leave$(node) {
		// const { node } = getContext(this);
		return fromEvent(node, 'mouseleave').pipe(
			tap(event => {
				LocomotiveScrollService.start();
			}),
		);
	}

	/*
	onDestroy() {
		this.removeListeners();
	}

	onEnter(event) {
		LocomotiveScrollService.stop();
	}

	onLeave(event) {
		LocomotiveScrollService.start();
	}

	addListeners() {
		const { node } = getContext(this);
		node.addEventListener('mouseenter', this.onEnter);
		node.addEventListener('mouseleave', this.onLeave);
	}

	removeListeners() {
		const { node } = getContext(this);
		node.removeEventListener('mouseenter', this.onEnter);
		node.removeEventListener('mouseleave', this.onLeave);
	}
	*/
}

DropdownItemDirective.meta = {
	selector: '[dropdown-item], [[dropdown-item]]',
	inputs: ['dropdown-item']
};
