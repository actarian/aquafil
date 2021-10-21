import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import RequiredIfValidator from '../../controls/required-if.validator';
import { ContactsService } from './contacts.service';

export class ContactModalComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			telephone: new FormControl(null),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			city: new FormControl(null, [Validators.RequiredValidator()]),
			message: new FormControl(null),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			newsletter: new FormControl(null, [Validators.RequiredValidator()]),
			commercial: new FormControl(null, [Validators.RequiredValidator()]),
			promotion: new FormControl(null, [Validators.RequiredValidator()]),
			newsletterLanguage: new FormControl(null, [RequiredIfValidator('newsletter', form)]),
			checkRequest: window.antiforgery,
			checkField: '',
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

	test() {
		const form = this.form;
		const controls = this.controls;
		const country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			telephone: '0721 411112',
			country: country,
			city: 'Pesaro',
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
				this.success = true;
				form.reset();
				GtmService.push({
					'event': "Contact",
					'form_name': "Contatti"
				});
				if (form.value.newsletter) {
					GtmService.push({
						'event': "ContactNewsletter",
						'form_name': "ContattiNewsletter"
					});
				}
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
};