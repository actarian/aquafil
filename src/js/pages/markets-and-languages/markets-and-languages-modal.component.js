import { Component, getContext } from 'rxcomp';
import { first } from 'rxjs/operators';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { MarketsAndLanguagesService } from './markets-and-languages.service';

export class MarketsAndLanguagesModalComponent extends Component {

	onInit() {
		super.onInit();
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
		}
		LocomotiveScrollService.stop();
		this.currentMarket = environment.currentMarket;
		this.currentLanguage = environment.currentLanguage;
		this.markets = [];
		MarketsAndLanguagesService.all$(environment.currentCoId).pipe(
			first(),
		).subscribe(markets => {
			this.markets = markets;
			this.pushChanges();
		});
	}

	setMarket(market) {
		this.currentMarket = market.code;
		this.pushChanges();
	}

	onClose() {
		ModalService.reject();
	}

	onDestroy() {
		LocomotiveScrollService.start();
	}
}

MarketsAndLanguagesModalComponent.meta = {
	selector: '[markets-and-languages-modal]'
};
