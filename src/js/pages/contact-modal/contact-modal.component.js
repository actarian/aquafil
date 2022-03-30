import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { ContactsService } from './contacts.service';

export class ContactModalComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		this.response = null;
		this.message = null;
		const form = this.form = new FormGroup({
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
			checkRequest: window.antiforgery,
			checkField: '',
			action: 'save_contact',
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
				//if (this.countryId) {
				//	this.form.patch({
				//		country: this.countryId,
				//	});
				//}
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
		console.log('ContactModalComponent.onSubmit', form.value);
		// console.log('ContactModalComponent.onSubmit', 'form.valid', valid);
		if (form.valid) {
			// console.log('ContactModalComponent.onSubmit', form.value);
			form.submitted = true;
			ContactsService.submit$(form.value).pipe(
				first(),
			).subscribe(_ => {
				if (_.success) {
					GtmService.push({ 'event': "Contact", 'form_name': "Contatti" });
				}
				this.success = true;
				form.reset();
				this.response = _.data["response"];
				this.message = _.data["message"];
			}, error => {
				console.log('ContactModalComponent.error', error);
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

ContactModalComponent.meta = {
	selector: '[contact-modal]',
	inputs: [],
};
