import { ControlComponent } from './control.component';

export class ControlTextComponent extends ControlComponent {

	onInit() {
		super.onInit();
		this.disabled = this.disabled || false;
	}

}

ControlTextComponent.meta = {
	selector: '[control-text]',
	inputs: ['control', 'label', 'disabled'],
	template: /* html */ `
		<div class="group--form" [class]="{ required: control.validators.length, disabled: disabled }">
			<label [labelFor]="uniqueId"><span [innerHTML]="label"></span> <span class="required__sign">*</span></label>
			<span class="required__badge" [innerHTML]="'required' | label"></span>
			<input [id]="uniqueId" type="text" class="control--text" [formControl]="control" [placeholder]="label" [disabled]="disabled" />
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
