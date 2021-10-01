import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, switchMap, takeUntil } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { UserService } from './user.service';

export class UserAccessDataComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			password: new FormControl(null, Validators.RequiredValidator()),
			newPassword: new FormControl(null, Validators.RequiredValidator()),
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
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			if (user) {
				form.patch({ email: user.email }, true);
			}
		});
	}

	onSubmit() {
		const form = this.form;
		console.log('UserAccessDataComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			UserService.accessData$(form.value).pipe(
				first(),
				//switchMap(_ => UserService.signout$())
			).subscribe(response => {
				console.log('UserAccessDataComponent.onSubmit', response);
				this.success = true;
				GtmService.push({
					'event': "AccessData",
					'form_name': "AccessData"
				});
				form.reset();
			}, error => {
				console.log('UserAccessDataComponent.error', error);
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

UserAccessDataComponent.meta = {
	selector: '[user-access-data]',
};
