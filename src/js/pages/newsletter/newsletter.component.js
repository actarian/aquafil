import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil, tap } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { LocationService } from '../../common/location/location.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { FormService } from '../../controls/form.service';
import RequiredIfValidator from '../../controls/required-if.validator';
import { NewsletterService } from './newsletter.service';

export class NewsletterComponent extends Component {

	onInit() {
		this.error = null;
		this.success = false;
		const email = LocationService.deserialize('email');
		// console.log('NewsletterComponent', email);
		const form = this.form = new FormGroup({
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			email: new FormControl(email, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			occupation: new FormControl(null, [Validators.RequiredValidator()]),
			telephone: new FormControl(null),
			country: new FormControl(null, [Validators.RequiredValidator()]),
			region: new FormControl(null, [new RequiredIfValidator('country', form, 114)]), // required if country === 114, Italy
			city: new FormControl(null, [Validators.RequiredValidator()]),
			engagement: new FormControl(null),
			newsletter: true,
			newsletterLanguage: new FormControl(null, [Validators.RequiredValidator()]),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			commercial: new FormControl(null, [Validators.RequiredValidator()]),
			promotion: new FormControl(null, [Validators.RequiredValidator()]),
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
		).subscribe();
	}

	load$() {
		return NewsletterService.data$().pipe(
			tap(data => {
				const controls = this.controls;
				controls.occupation.options = FormService.toSelectOptions(data.occupation.options);
				controls.country.options = FormService.toSelectOptions(data.country.options);
				controls.region.options = FormService.toSelectOptions(data.region.options);
				controls.engagement.options = FormService.toSelectOptions(data.engagement.options);
				controls.newsletterLanguage.options = FormService.toSelectOptions(data.newsletterLanguage.options);
				this.pushChanges();
			})
		);
	}

	test() {
		const form = this.form;
		const controls = this.controls;
		const occupation = controls.occupation.options.length > 1 ? controls.occupation.options[1].id : null;
		const country = controls.country.options.length > 1 ? controls.country.options[1].id : null;
		const region = controls.region.options.length > 1 ? controls.region.options[1].id : null;
		const engagement = controls.engagement.options.length > 1 ? controls.engagement.options[1].id : null;
		const newsletterLanguage = controls.newsletterLanguage.options.length > 1 ? controls.newsletterLanguage.options[1].id : null;
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			email: 'jhonappleseed@gmail.com',
			telephone: '0721 411112',
			occupation: occupation,
			country: country,
			region: region,
			city: 'Pesaro',
			engagement: engagement,
			newsletterLanguage: newsletterLanguage,
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
		console.log('NewsletterComponent.onSubmit', form.value);
		// console.log('NewsletterComponent.onSubmit', 'form.valid', valid);
		if (form.valid) {
			// console.log('NewsletterComponent.onSubmit', form.value);
			form.submitted = true;
			NewsletterService.submit$(form.value).pipe(
				first(),
			).subscribe(_ => {
				this.success = true;
				form.reset();
				GtmService.push({
					'event': "Newsletter",
					'form_name': "Newsletter"
				});
			}, error => {
				console.log('NewsletterComponent.error', error);
				this.error = error;
				this.pushChanges();
				LocomotiveScrollService.update();
			});
		} else {
			form.touched = true;
		}
	}

}

NewsletterComponent.meta = {
	selector: '[newsletter]',
};
