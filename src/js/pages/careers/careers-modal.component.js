import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import { CareersService } from './careers.service';

export class CareersModalComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		this.response = null;
		this.message = null;
		const form = this.form = new FormGroup({
			countryOfInterest: new FormControl(this.countryOfInterestId),
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null),
			address: new FormControl(null),
			city: new FormControl(null),
			zip: new FormControl(null),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			file: new FormControl(null, [Validators.RequiredValidator()]),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			checkRequest: window.antiforgery,
			checkField: '',
			action: 'save_career',
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
		return CareersService.data$().pipe(
			tap(data => {
				this.data = data;
				const controls = this.controls;
				controls.country.options = FormService.toSelectOptions(data.country.options);
				/*
				if (this.countryId) {
					this.form.patch({
						country: this.countryId,
					});
				}
				*/
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
			file: 'file',
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
		console.log('CareersModalComponent.onSubmit', form.value);
		// console.log('CareersModalComponent.onSubmit', 'form.valid', valid);
		if (form.valid) {
			// console.log('CareersModalComponent.onSubmit', form.value);
			form.submitted = true;
			CareersService.submit$(form.value).pipe(
				first(),
			).subscribe(_ => {
				if (_.success) {
					GtmService.push({ 'event': "Careers", 'form_name': "Contatti" });
				}
				this.success = true;
				form.reset();
				this.response = _.data["response"];
				this.message = _.data["message"];
			}, error => {
				console.log('CareersModalComponent.error', error);
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

CareersModalComponent.meta = {
	selector: '[careers-modal]',
	inputs: ['countryOfInterestId'],
};
