import { ControlComponent } from './control.component';

export class ControlSearchComponent extends ControlComponent {

	onInit() {
		super.onInit();
		this.disabled = this.disabled || false;
	}

}

ControlSearchComponent.meta = {
	selector: '[control-search]',
	inputs: ['control', 'label', 'disabled'],
	template: /* html */ `
		<div class="group--form" [class]="{ required: control.validators.length, disabled: disabled }">
			<svg class="search"><use xlink:href="#search"></use></svg>
			<input type="text" class="control--text" [formControl]="control" [placeholder]="label" [disabled]="disabled" />
		</div>
	`
};
