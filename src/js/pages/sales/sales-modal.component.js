import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { SalesService } from './sales.service';

export class SalesModalComponent extends Component {

	onInit() {
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			const id = data.id;
			const productName = this.productName = data.productName ? data.productName : this.productName;
			const area = this.area = data.area ? data.area : this.area;
			const countryOfInterestId = this.countryOfInterestId = data.countryOfInterestId ? data.countryOfInterestId : this.countryOfInterestId;
			const agent = this.agent = data.agent;
			console.log('SalesModalComponent.onInit', id, productName, area, countryOfInterestId, agent);
		}
		this.error = null;
		this.success = false;
		this.response = '';
		this.message = '';
		const form = this.form = new FormGroup({
			productName: this.productName,
			countryOfInterest: new FormControl(this.countryOfInterestId),
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null),
			address: new FormControl(null),
			city: new FormControl(null),
			zip: new FormControl(null),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			subject: new FormControl(null),
			message: new FormControl(null),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			agent: this.agent,
			checkRequest: window.antiforgery,
			checkField: '',
			action: 'save_agent_contact',
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
		return SalesService.data$().pipe(
			tap(data => {
				const controls = this.controls;
				controls.country.options = FormService.toSelectOptions(data.country.options);
				this.pushChanges();
			})
		);
	}

	test() {
		const form = this.form;
		const controls = this.controls;
		const country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			company: 'Websolute',
			address: 'Strada della Campanara, 15',
			city: 'Pesaro',
			zip: 61122,
			country: country,
			email: 'jhonappleseed@gmail.com',
			subject: 'Subject',
			message: 'Hi!',
			privacy: true,
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	reset() {
		const form = this.form;
		form.reset();
	}

	onSubmit(model) {
		const form = this.form;
		console.log('SalesModalComponent.onSubmit', form.value);
		// console.log('SalesModalComponent.onSubmit', 'form.valid', valid);
		if (form.valid) {
			// console.log('SalesModalComponent.onSubmit', form.value);
			form.submitted = true;
			SalesService.submit$(form.value).pipe(
				first(),
			).subscribe(_ => {
				if (_.success) {
					GtmService.push({ 'event': "Sales", 'form_name': "Contatti" });
				}
				this.success = true;
				form.reset();
				this.response = _.data["response"];
				this.message = _.data["message"];
			}, error => {
				console.log('SalesModalComponent.error', error);
				this.error = error;
				this.pushChanges();
			});
		} else {
			form.touched = true;
		}
	}

	onClose() {
		ModalService.reject();
	}
}

SalesModalComponent.meta = {
	selector: '[sales-modal]',
	inputs: ['productName', 'countryOfInterestId'],
};
