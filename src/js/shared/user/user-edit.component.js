import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { combineLatest } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { FormService } from '../../controls/form.service';
import RequiredIfValidator from '../../controls/required-if.validator';
import { UserService } from './user.service';

export class UserEditComponent extends Component {

	onInit() {
		this.user = null;
		this.error = null;
		this.success = false;
		this.responseMessage = null;
		const form = this.form = new FormGroup({
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			city: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null),
			occupation: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
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
			LocomotiveScrollService.update();
		});
		this.load$().pipe(
			first(),
			takeUntil(this.unsubscribe$)
		).subscribe();
	}

	load$() {
		return combineLatest([UserService.data$(), UserService.me$()]).pipe(
			tap(results => {
				const data = results[0];
				const controls = this.controls;
				controls.country.options = FormService.toSelectOptions(data.country.options);
				controls.occupation.options = FormService.toSelectOptions(data.occupation.options);
				controls.newsletterLanguage.options = FormService.toSelectOptions(data.newsletterLanguage.options);
				const user = results[1];
				this.user = user;
				if (user) {
					const form = this.form;
					form.patch(user, true);
				}
				this.pushChanges();
			}),
		);
	}

	test() {
		const form = this.form;
		const controls = this.controls;
		const country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
		const occupation = controls.occupation.options.length > 1 ? controls.occupation.options[1].id : null;
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			country: country,
			city: 'Pesaro',
			company: 'Websolute',
			occupation: occupation,
			email: 'jhonappleseed@gmail.com',
			privacy: true,
		});
	}

	reset() {
		const form = this.form;
		form.reset();
	}

	onSubmit() {
		this.responseMessage = null;
		const form = this.form;
		console.log('UserEditComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			UserService.edit$(form.value).pipe(
				first(),
			).subscribe(response => {
				console.log('UserEditComponent.onSubmit', response);
				this.responseMessage = response.responseMessage;
				this.success = true;
				/*
				GtmService.push({
					'event': "Registration",
					'form_name': "Registrazione"
				});
				*/
				form.reset();
			}, error => {
				console.log('UserEditComponent.error', error);
				this.error = error;
				form.submitted = false;
				this.pushChanges();
				LocomotiveScrollService.update();
			});
		} else {
			form.touched = true;
		}
	}
}

UserEditComponent.meta = {
	selector: '[user-edit]',
};
