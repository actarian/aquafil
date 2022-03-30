import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';

export class OpenModallyDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		const selector = node.getAttribute('open-modally');
		let target = document.querySelector(selector);
		if (target) {
			target = target.cloneNode(true);
			// target.parentNode.removeChild(target);
			this.click$(target).pipe(
				takeUntil(this.unsubscribe$),
			).subscribe();
		}
	}

	click$(target) {
		const { node, module } = getContext(this);
		return fromEvent(node, 'click').pipe(
			tap(_ => {
				ModalService.open$({ src: environment.template.modal.sideModal, data: { target: target.cloneNode(true) } }).pipe(
					first(),
				).subscribe(event => {
					console.log('OpenModallyDirective.open$', event);
				});
			}),
		);
	}

}

OpenModallyDirective.meta = {
	selector: '[open-modally]'
};
