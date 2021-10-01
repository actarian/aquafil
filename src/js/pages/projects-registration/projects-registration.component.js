import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { FormService } from '../../controls/form.service';
import RequiredIfValidator from '../../controls/required-if.validator';
import { ProjectsRegistrationService } from './projects-registration.service';

export class ProjectsRegistrationComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			dealer: new FormGroup({
				fullName: new FormControl(null, [Validators.RequiredValidator()]),
				country: new FormControl(null, [Validators.RequiredValidator()]),
				city: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			client: new FormGroup({
				fullName: new FormControl(null, [Validators.RequiredValidator()]),
				country: new FormControl(null, [Validators.RequiredValidator()]),
				city: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			architect: new FormGroup({
				fullName: new FormControl(null, [Validators.RequiredValidator()]),
				country: new FormControl(null, [Validators.RequiredValidator()]),
				city: new FormControl(null, [Validators.RequiredValidator()]),
				email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
				telephone: new FormControl(null, [Validators.RequiredValidator()]),
			}),
			type: new FormControl(null, [Validators.RequiredValidator()]),
			destination: new FormControl(null, [Validators.RequiredValidator()]),
			products: new FormControl(null, [Validators.RequiredValidator()]),
			picture: new FormControl(null),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			//newsletter: new FormControl(null, [Validators.RequiredValidator()]),
			//commercial: new FormControl(null, [Validators.RequiredValidator()]),
			//promotion: new FormControl(null, [Validators.RequiredValidator()]),
			//newsletterLanguage: new FormControl(null, [RequiredIfValidator('newsletter', form)]),
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
		return ProjectsRegistrationService.data$().pipe(
			tap(data => {
				const controls = this.controls;
				controls.dealer.controls.country.options = FormService.toSelectOptions(data.country.options);
				controls.client.controls.country.options = FormService.toSelectOptions(data.country.options);
				controls.architect.controls.country.options = FormService.toSelectOptions(data.country.options);
				this.pushChanges();
			})
		);
	}

	test() {
		const form = this.form;
		const controls = this.controls;
		const country = controls.dealer.controls.country.options.length > 1 ? controls.dealer.controls.country.options[1].id : null;
		form.patch({
			dealer: {
				fullName: 'Agente Jhon Appleseed',
				country: country,
				city: 'Pesaro',
			},
			client: {
				fullName: 'Cliente Jhon Appleseed',
				country: country,
				city: 'Pesaro',
			},
			architect: {
				fullName: 'Architetto Jhon Appleseed',
				country: country,
				city: 'Pesaro',
				email: 'jhonappleseed@gmail.com',
				telephone: '0721411112',
			},
			type: 'Hotel',
			destination: 'Hospitality',
			products: 'Adam, Clop',
			privacy: true,
		});
	}

	reset() {
		const form = this.form;
		form.reset();
	}

	onSubmit() {
		const form = this.form;
		console.log('ProjectsRegistrationComponent.onSubmit', form.value);
		if (form.valid) {
			form.submitted = true;
			ProjectsRegistrationService.submit$(form.value).pipe(
				first(),
			).subscribe(response => {
				console.log('ProjectsRegistrationComponent.onSubmit', response);
				this.success = true;
				GtmService.push({
					'event': "Project Registration",
					'form_name': "Registrazione Progetto"
				});
				if (!this.isModal) {
					form.reset();
				} else {
					this.pushChanges();
				}
			}, error => {
				console.log('ProjectsRegistrationComponent.error', error);
				this.error = error;
				form.submitted = false;
				this.pushChanges();
				LocomotiveScrollService.update();
			});
		} else {
			form.touched = true;
		}
	}

	onClose() {
		this.close.next(this.form.value);
	}
}

ProjectsRegistrationComponent.meta = {
	selector: '[projects-registration]',
	outputs: ['close'],
	inputs: ['isModal'],
};
