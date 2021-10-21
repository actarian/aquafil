import { Component } from 'rxcomp';
import { first } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';

export class CardProductDetailComponent extends Component {

	onRequestInfo() {
		ModalService.open$({ src: environment.template.modal.contactModal, data: { id: this.id } }).pipe(
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
