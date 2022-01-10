import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { first, takeUntil } from 'rxjs/operators';
import { GtmService } from '../../common/gtm/gtm.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';
import { ProductRequestService } from './product-request.service';

export class ProductRequestComponent extends Component {

	onInit() {
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			const id = data.id;
			const productName = data.productName;
			this.productName = productName ? productName : this.productName;
			console.log('ProductRequestComponent.onInit', id, productName);
		}
		this.error = null;
		this.success = false;
		const form = this.form = new FormGroup({
			productName: new FormControl(this.productName),
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null, [Validators.RequiredValidator()]),
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
	}

	test() {
		const form = this.form;
		const controls = this.controls;
		form.patch({
			firstName: 'Jhon',
			lastName: 'Appleseed',
			company: 'Websolute',
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
		console.log('ProductRequestComponent.onSubmit', form.value);
		// console.log('ProductRequestComponent.onSubmit', 'form.valid', valid);
		if (form.valid) {
			// console.log('ProductRequestComponent.onSubmit', form.value);
			form.submitted = true;
			ProductRequestService.submit$(form.value).pipe(
				first(),
			).subscribe(_ => {
				this.success = true;
				form.reset();
				GtmService.push({ 'event': "Product Request", 'form_name': "Product Request" });
			}, error => {
				console.log('ProductRequestComponent.error', error);
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

ProductRequestComponent.meta = {
	selector: '[product-request]',
	inputs: ['productName'],
};
