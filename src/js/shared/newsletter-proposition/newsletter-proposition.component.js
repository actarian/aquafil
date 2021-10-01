import { Component } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { takeUntil } from 'rxjs/operators';
import { LocationService } from '../../common/location/location.service';

export class NewsletterPropositionComponent extends Component {

	onInit() {
		const form = this.form = new FormGroup({
			email: new FormControl(null, [Validators.RequiredValidator()]),
		});
		const controls = this.controls = form.controls;
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			this.pushChanges();
		});
	}

	onNewsletter(event) {
		console.log('NewsletterPropositionComponent.onNewsletter', this.form.value);
		const encoded = LocationService.encode('email', this.form.value.email, {});
		window.location.href = `${this.action}?params=${encoded}`;
	}
}

NewsletterPropositionComponent.meta = {
	selector: '[newsletter-proposition]',
	inputs: ['action'],
};
