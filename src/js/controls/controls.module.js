import { Module } from 'rxcomp';
import { ControlCheckboxComponent } from './control-checkbox.component';
import { ControlCustomSelectComponent } from './control-custom-select.component';
import { ControlEmailComponent } from './control-email.component';
import { ControlFileComponent } from './control-file.component';
import { ControlPasswordComponent } from './control-password.component';
import { ControlPrivacyComponent } from './control-privacy.component';
import { ControlSearchComponent } from './control-search.component';
import { ControlTextComponent } from './control-text.component';
import { ControlTextareaComponent } from './control-textarea.component';
import { ErrorsComponent } from './errors.component';
import { TestComponent } from './test.component';

const factories = [
	ControlCheckboxComponent,
	ControlCustomSelectComponent,
	ControlEmailComponent,
	ControlFileComponent,
	ControlPasswordComponent,
	ControlPrivacyComponent,
	// ControlSelectComponent,
	ControlSearchComponent,
	ControlTextareaComponent,
	ControlTextComponent,
	// DisabledDirective,
	ErrorsComponent,
	TestComponent,
	// ValueDirective,
];

const pipes = [
];

export class ControlsModule extends Module { }

ControlsModule.meta = {
	imports: [
	],
	declarations: [
		...factories,
		...pipes,
	],
	exports: [
		...factories,
		...pipes,
	],
};
