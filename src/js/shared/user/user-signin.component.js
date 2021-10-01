import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { UserService } from './user.service';

export class UserSigninComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			password: new FormControl(null, Validators.RequiredValidator()),
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
			password: '********',
		});
	}

	reset() {
		const form = this.form;
		form.reset();
	}

	onSubmit() {
		const form = this.form;
		console.log('UserSigninComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			UserService.signin$(form.value).pipe(
				first(),
			).subscribe(response => {
				console.log('UserSigninComponent.onSubmit', response);
				this.success = true;
				GtmService.push({
					'event': "Signin",
					'form_name': "Login"
				});
				form.reset();
				this.signIn.next(response);
			}, error => {
				console.log('UserSigninComponent.error', error);
				this.error = error;
				form.submitted = false;
				this.pushChanges();
				LocomotiveScrollService.update();
			});
		} else {
			form.touched = true;
		}
	}

	onForgot(event) {
		this.viewForgot.next();
	}

	onSignUp(event) {
		this.viewSignUp.next();
	}
}

UserSigninComponent.meta = {
	selector: '[user-signin]',
	outputs: ['signIn', 'viewForgot', 'viewSignUp'],
};
