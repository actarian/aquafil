import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { environment } from '../../environment';
import { SalesService } from '../sales/sales.service';

export class CardSaleDetailComponent extends Component {

	onInit() {
		this.data = null;
		this.agent = null;
		const form = this.form = new FormGroup({
			country: new FormControl(null, [Validators.RequiredValidator()]),
		});
		const controls = this.controls = form.controls;
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((values) => {
			if (this.data) {
				this.agent = this.data.agent.find(x => x.country.value == values.country && x.area.label == this.area);
			}
			this.pushChanges();
		});
		this.load$().pipe(
			first(),
		).subscribe();
	}

	load$() {
		return SalesService.data$().pipe(
			tap(data => {
				this.data = data;
				const controls = this.controls;
				controls.country.options = FormService.toSelectOptions(data.country.options);
				this.pushChanges();
			})
		);
	}

	onRequestInfo() {
		if (this.form.valid) {
			ModalService.open$({ src: environment.template.modal.salesModal, data: { productName: this.productName, countryOfInterestId: this.form.value.country, agent: this.agent.email } }).pipe(
				first(),
			).subscribe(event => {
				this.data = null;
				this.agent = null;
				console.log('CardSaleDetailComponent.open$', event);
			});
		}
	}

}

CardSaleDetailComponent.meta = {
	selector: '[card-sale-detail]',
	inputs: ['id', 'productName', 'area'],
};
