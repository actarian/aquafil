import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { UserService } from './user.service';

export class UserForgotComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
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
	}

	test() {
		const form = this.form;
		form.patch({
			email: 'jhonappleseed@gmail.com',
		});
	}

	reset() {
		const form = this.form;
		form.reset();
	}

	onSubmit() {
		const form = this.form;
		console.log('UserForgotComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			UserService.forgot$(form.value).pipe(
				first(),
			).subscribe(response => {
				console.log('UserForgotComponent.onSubmit', response);
				this.success = true;
				GtmService.push({
					'event': "Forgot",
					'form_name': "Recupero Password"
				});
				form.reset();
				this.forgot.next(true);
			}, error => {
				console.log('UserForgotComponent.error', error);
				this.error = error;
				form.submitted = false;
				this.pushChanges();
				LocomotiveScrollService.update();
			});
		} else {
			form.touched = true;
		}
	}

	onSignIn() {
		this.viewSignIn.next();
	}

	onSignUp() {
		this.viewSignUp.next();
	}
}

UserForgotComponent.meta = {
	selector: '[user-forgot]',
	outputs: ['forgot', 'viewSignIn', 'viewSignUp'],
};
