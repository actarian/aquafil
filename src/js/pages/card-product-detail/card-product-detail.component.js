import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';

export class CardProductDetailComponent extends Component {
	onRequestInfo(id, product, download, recipient) {
		ModalService.open$({ src: environment.template.modal.productRequestModal, data: { id: id, productName: product, download: download, recipient: recipient } }).pipe(
			first(),
		).subscribe(event => {
			console.log('CardProductDetailComponent.open$', event);
		});
	}
}

CardProductDetailComponent.meta = {
	selector: '[card-product-detail]',
	inputs: ['id'],
};
