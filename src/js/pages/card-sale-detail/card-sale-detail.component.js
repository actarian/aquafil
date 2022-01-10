import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { environment } from '../../environment';
import { ContactsService } from '../contact-modal/contacts.service';

export class CardSaleDetailComponent extends Component {

	onInit() {
		const form = this.form = new FormGroup({
			country: new FormControl(null, [Validators.RequiredValidator()]),
		});
		const controls = this.controls = form.controls;
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			this.pushChanges();
		});
		this.load$().pipe(
			first(),
		).subscribe();
	}

	load$() {
		return ContactsService.data$().pipe(
			tap(data => {
				const controls = this.controls;
				controls.country.options = FormService.toSelectOptions(data.country.options);
				this.pushChanges();
			})
		);
	}

	onRequestInfo() {
		if (this.form.valid) {
			ModalService.open$({ src: environment.template.modal.salesModal, data: { id: this.id, productName: this.productName, countryOfInterestId: this.form.value.country } }).pipe(
				first(),
			).subscribe(event => {
				console.log('CardSaleDetailComponent.open$', event);
			});
		}
	}

}

CardSaleDetailComponent.meta = {
	selector: '[card-sale-detail]',
	inputs: ['id', 'productName'],
};
