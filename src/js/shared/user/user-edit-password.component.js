import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { UserService } from './user.service';

export class UserEditPasswordComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			tokenEncoded: this.tokenEncoded,
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

	onSubmit() {
		const form = this.form;
		console.log('UserEditPasswordComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			UserService.editPassword$(form.value).pipe(
				first(),
				switchMap(_ => UserService.signout$())
			).subscribe(response => {
				console.log('UserEditPasswordComponent.onSubmit', response);
				this.success = true;
				GtmService.push({
					'event': "EditPassword",
					'form_name': "EditPassword"
				});
				form.reset();
			}, error => {
				console.log('UserEditPasswordComponent.error', error);
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

UserEditPasswordComponent.meta = {
	selector: '[user-edit-password]',
	inputs: ['tokenEncoded'],
};
