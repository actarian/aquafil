import { ControlComponent } from './control.component';

export class ControlEmailComponent extends ControlComponent {

	onInit() {
		super.onInit();
	}

}

ControlEmailComponent.meta = {
	selector: '[control-email]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form" [class]="{ required: control.validators.length }">
			<label [labelFor]="uniqueId"><span [innerHTML]="label"></span> <span class="required__sign">*</span></label>
			<input [id]="uniqueId" type="text" class="control--text" [formControl]="control" [placeholder]="label" required email />
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
