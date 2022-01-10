import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { ContactsService } from './contacts.service';

export class ContactModalComponent extends Component {

	onInit() {
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			const id = data.id;
			const countryId = data.countryId;
			this.countryId = countryId ? countryId : this.countryId;
			console.log('ContactModalComponent.onInit', id, countryId);
		}
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null, [Validators.RequiredValidator()]),
			address: new FormControl(null, [Validators.RequiredValidator()]),
			city: new FormControl(null, [Validators.RequiredValidator()]),
			zip: new FormControl(null, [Validators.RequiredValidator()]),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			subject: new FormControl(null, [Validators.RequiredValidator()]),
			message: new FormControl(null, [Validators.RequiredValidator()]),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
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
				if (this.countryId) {
					this.form.patch({
						country: this.countryId,
					});
				}
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
				this.success = true;
				form.reset();
				GtmService.push({
					'event': "Contact",
					'form_name': "Contatti"
				});
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
	inputs: ['countryId'],
};
