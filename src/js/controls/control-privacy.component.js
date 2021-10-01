import { getContext } from 'rxcomp';
import { from, fromEvent, merge } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../common/modal/modal.service';
import { environment } from '../environment';
import { ControlComponent } from './control.component';

export class ControlPrivacyComponent extends ControlComponent {

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

	onChanges() {
		const { node } = getContext(this);
		const inputs = Array.prototype.slice.call(node.querySelectorAll('input'));
		inputs.forEach((input, i) => {
			(this.control.value === true && i === 0) || (this.control.value === false && i === 1) ? input.setAttribute('checked', '') : input.removeAttribute('checked');
		});
	}

	onSelect(value) {
		this.control.value = value;
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
				// console.log('ControlPrivacyComponent.link$.href', href);
				return from(fetch(href).then(response => response.text()));
			}),
			tap(html => {
				// console.log('ControlPrivacyComponent.link$.html', html);
				const parser = new DOMParser();
				const htmlDocument = parser.parseFromString(html, 'text/html');
				// console.log('ControlPrivacyComponent.link$.htmlDocument', htmlDocument);
				let title = htmlDocument.querySelector('.section--intro-sm .title');
				title = title ? title.innerHTML : null;
				let abstract = htmlDocument.querySelector('.section--intro-sm .descritpion');
				abstract = abstract ? abstract.innerHTML : null;
				let description = htmlDocument.querySelector('.section--text .col-md-6');
				description = description ? description.innerHTML : null;
				ModalService.open$({ src: environment.template.modal.genericModal, data: { title: title, abstract: abstract, description: description } }).pipe(
					takeUntil(this.unsubscribe$)
				).subscribe(event => {
					// console.log('ControlPrivacyComponent.link$.genericModal', event);
				});
			}),
		);
	}

}

ControlPrivacyComponent.meta = {
	selector: '[control-privacy]',
	inputs: ['control', 'label', 'target'],
	template: /* html */ `
		<div class="group--form--privacy" [class]="{ required: control.validators.length }">
			<div class="group--inputs">
				<input type="radio" class="control--checkbox" [id]="uniqueId + '_true'" [name]="uniqueId" [value]="true" (change)="onSelect(true)" />
				<label [labelFor]="uniqueId + '_true'">
					<svg class="icon icon--checkbox"><use xlink:href="#checkbox"></use></svg>
					<svg class="icon icon--checkbox-checked"><use xlink:href="#checkbox-checked"></use></svg>
					<span>Acconsento</span>
				</label>
				<input type="radio" class="control--checkbox" [id]="uniqueId + '_false'" [name]="uniqueId" [value]="false" (change)="onSelect(false)" />
				<label [labelFor]="uniqueId + '_false'">
					<svg class="icon icon--checkbox"><use xlink:href="#checkbox"></use></svg>
					<svg class="icon icon--checkbox-checked"><use xlink:href="#checkbox-checked"></use></svg>
					<span>Non acconsento</span>
				</label>
			</div>
			<div class="description">
				<span [innerHTML]="label | html"></span>
				<span class="required__sign">*</span>
			</div>
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
