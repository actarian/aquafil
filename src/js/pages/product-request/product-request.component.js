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
			const recipient = data.recipient;
			this.recipient = recipient ? recipient : this.recipient;
			const download = data.download;
			this.download = download ? download : this.download;
			console.log('ProductRequestComponent.onInit', id, productName);
		}
		this.error = null;
		this.success = false;
		this.response = '';
		this.message = '';
		const form = this.form = new FormGroup({
			productName: this.productName,
			recipient: this.recipient,
			download: this.download,
			firstName: new FormControl(null, [Validators.RequiredValidator()]),
			lastName: new FormControl(null, [Validators.RequiredValidator()]),
			company: new FormControl(null),
			email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
			subject: new FormControl(null),
			message: new FormControl(null),
			privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
			checkRequest: window.antiforgery,
			checkField: '',
			action: 'save_product_request',
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
				if (_.success) {
					GtmService.push({ 'event': "Product Request", 'form_name': "Product Request" });
				}
				this.success = true;
				form.reset();
				this.response = _.data["response"];
				this.message = _.data["message"];
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
	inputs: ['productName', 'download'],
};
