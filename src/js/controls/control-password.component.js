import { getContext } from 'rxcomp';
import { ControlComponent } from './control.component';

export class ControlPasswordComponent extends ControlComponent {

	onInit() {
		super.onInit();
		const { node } = getContext(this);
		if (node.hasAttribute('secure')) {
			// const name = [..."abcdefghijklmnopqrsuvwxyz0123456789"].map((c, i, a) => a[Math.floor(Math.random() * a.length)]).join('');
			const input = node.querySelector('input');
			input.setAttribute('autocomplete', 'new-password');
		}
	}

}

ControlPasswordComponent.meta = {
	selector: '[control-password]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form" [class]="{ required: control.validators.length }">
			<label [labelFor]="uniqueId"><span [innerHTML]="label"></span> <span class="required__sign">*</span></label>
			<input [id]="uniqueId" type="password" class="control--text" [formControl]="control" [placeholder]="label" />
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
