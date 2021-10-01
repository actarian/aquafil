import { getContext } from 'rxcomp';
import { from, fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../common/modal/modal.service';
import { environment } from '../environment';
import { ControlComponent } from './control.component';

export class ControlCheckboxComponent extends ControlComponent {

	onInit() {
		super.onInit();
		if (this.target === 'modal') {
			setTimeout(() => {
				this.link$().pipe(
					takeUntil(this.unsubscribe$),
				).subscribe();
			}, 1);
		}
	}

	link$() {
		const { node } = getContext(this);
		const anchors = Array.prototype.slice.call(node.querySelectorAll('a'));
		// console.log(anchors, node.innerHTML);
		return merge(...anchors.map(anchor => fromEvent(anchor, 'click'))).pipe(
			switchMap(event => {
				event.preventDefault();
				event.stopPropagation();
				// console.log('UserDetailComponent.onModalUserUpdate');
				const anchor = event.target;
				const href = anchor.getAttribute('href');
				// console.log('ControlCheckboxComponent.link$.href', href);
				return from(fetch(href).then(response => response.text()));
			}),
			tap(html => {
				// console.log('ControlCheckboxComponent.link$.html', html);
				const parser = new DOMParser();
				const htmlDocument = parser.parseFromString(html, 'text/html');
				// console.log('ControlCheckboxComponent.link$.htmlDocument', htmlDocument);
				let title = htmlDocument.querySelector('.section--intro-sm .title');
				title = title ? title.innerHTML : null;
				let abstract = htmlDocument.querySelector('.section--intro-sm .descritpion');
				abstract = abstract ? abstract.innerHTML : null;
				let description = htmlDocument.querySelector('.section--text .col-md-6');
				description = description ? description.innerHTML : null;
				ModalService.open$({ src: environment.template.modal.genericModal, data: { title: title, abstract: abstract, description: description } }).pipe(
					takeUntil(this.unsubscribe$)
				).subscribe(event => {
					// console.log('ControlCheckboxComponent.link$.genericModal', event);
				});
			}),
		);
	}

}

ControlCheckboxComponent.meta = {
	selector: '[control-checkbox]',
	inputs: ['control', 'label', 'target'],
	template: /* html */ `
		<div class="group--form--checkbox" [class]="{ required: control.validators.length }">
			<input [id]="uniqueId" type="checkbox" class="control--checkbox" [formControl]="control" [value]="true" />
			<label [labelFor]="uniqueId">
				<svg class="icon icon--checkbox"><use xlink:href="#checkbox"></use></svg>
				<svg class="icon icon--checkbox-checked"><use xlink:href="#checkbox-checked"></use></svg>
				<span [innerHTML]="label | html"></span>
				<span class="required__sign">*</span>
			</label>
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
