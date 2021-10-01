import { Component } from 'rxcomp';

export class ErrorComponent extends Component {

	onInit() {
		this.showDetail = false;
		// console.log('ErrorComponent.onInit', this.error);
	}

	onDetailToggle() {
		this.showDetail = !this.showDetail;
		this.pushChanges();
	}
}

ErrorComponent.meta = {
	selector: 'error-component',
	inputs: ['error'],
	template: /* html */ `
	<div class="error" (click)="onDetailToggle($event)">
		<div class="status">Error <span [innerHTML]="error.status"></span></div>
		<div class="exception-message" [innerHTML]="error.exceptionMessage"></div>
		<button type="button" class="btn--detail"><svg class="caret-down"><use xlink:href="#caret-down"></use></svg></button>
	</div>
	<div class="error-details" *if="showDetail">
		<div class="message" [innerHTML]="error.message"></div>
		<div class="exception-type" [innerHTML]="error.exceptionType"></div>
		<div class="stack-trace" [innerHTML]="error.stackTrace"></div>
	</div>
	`
};
