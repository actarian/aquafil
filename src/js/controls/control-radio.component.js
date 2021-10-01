import { ControlComponent } from './control.component';

export class ControlRadioComponent extends ControlComponent {

	onInit() {
		super.onInit();
	}

}

ControlRadioComponent.meta = {
	selector: '[control-radio]',
	inputs: ['control', 'label'],
	template: /* html */ `
		<div class="group--form--radio" [class]="{ required: control.validators.length }">
			<label [labelFor]="uniqueId">
				<input [id]="uniqueId" type="radio" class="control--radio" [formControl]="control" [value]="true"/>
				<span [innerHTML]="label"></span>
				<span class="required__sign">*</span>
			</label>
			<span class="required__badge" [innerHTML]="'required' | label"></span>
		</div>
		<errors-component [control]="control"></errors-component>
	`
};
