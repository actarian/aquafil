import { Component, getContext } from 'rxcomp';
import { first } from 'rxjs/operators';
import { LocationService } from '../../common/location/location.service';
import { environment } from '../../environment';
import { CartMiniService } from '../../shared/cart-mini/cart-mini.service';
import { CartService } from '../cart/cart.service';

const breadcumbStyle = `font-size: .8rem; text-transform: uppercase; letter-spacing: 0.075em; color: #37393b; display: none;`;
const titleStyle = `letter-spacing: 0; font-family: 'Bauer Bodoni', sans-serif; font-size: 2.9rem; margin: 0;word-wrap: break-word;text-transform: uppercase;color:#37393b;`;
const designerStyle = `font-size: .8rem; letter-spacing: 0.075em;margin-bottom: 15px;word-wrap: break-word;text-transform: uppercase; display: none;`;
const descriptionStyle = `font-size: .8rem; text-align: left;margin-bottom: 15px; letter-spacing: 0.05em; display: none;`;

export class ProductsConfigureComponent extends Component {

	get priceListByMarket() {
		// !!! I listini YY possibili sono: A listino EUR, B listino GB, C listino USA, D listino RMB, E listino Medio oriente
		switch (environment.currentMarket.toLowerCase()) {
			default:
				return 'A';
		}
	}

	get showefyUrl() {
		if (this.product) {
			return `https://www.showefy.com/showroom/aquafil/?l=${environment.currentLanguage}&c=${environment.currentMarket.toLowerCase()}&list=${this.priceListByMarket}&codprod=${this.product.code}${this.product.familyCode ? `&codfam=${this.product.familyCode}` : ''}&autoEnter=1${this.sl ? `&ext&sl=${this.sl}` : ''}`;
		}
	}

	onInit() {
		this.sl = LocationService.get('sl');
		// console.log(this.code);
		if (!this.product) {
			throw ('ProductsConfigureComponent.error missing product');
		}
		this.isReady = false;
		this.isComplete = false;
		this.isConfiguring = false;
		const { node } = getContext(this);
		const iframe = this.iframe = node.querySelector('#showefy');
		if (!iframe) {
			throw ('missing iframe');
		}
		this.onEvent = this.onEvent.bind(this);
		const sfy = this.sfy = new SFYFrame(iframe, this.token, this.onEvent);
		sfy.init();
		// console.log('ProductsConfigureComponent.onInit', sfy, iframe);
	}

	getIframeDocument(iframe) {
		const content = iframe.contentWindow || iframe.contentDocument
		const iframeDocument = content.document ? content.document : content;
		return iframeDocument;
	}

	onEvent(data) {
		const event = JSON.parse(data);
		const eventName = event.emit;
		if (event.status == 0) {
			// console.log('ProductsConfigureComponent.onEvent', event);
			switch (eventName) {
				case 'showefy_ready':
					this.onReady(event);
					break;
				case 'showefy_complete':
					this.onShowefyComplete(event);
					break;
				case 'start_configurator':
					this.onStartConfigurator(event);
					break;
				case 'button_pressed':
					this.onButtonPressed(event);
					break;
				case 'setButtonStatus':
					this.onSetButtonStatus(event);
					break;
				case 'getIframeSize':
					this.onGetIframeSize(event);
					break;
				case 'getProductExtData':
					this.onGetProductExtData(event);
					break;
				case 'getFastProductExtData':
					this.onGetFastProductExtData(event);
					break;
			}
		} else {
			console.log('ProductsConfigureComponent.onEvent.error', event.status, event.statusTxt, eventName);
		}
	}

	onReady(event) {
		// console.log('ProductsConfigureComponent.onReady', event);
		this.isReady = true;
		// this.addTexts();
		this.addButtons();
		// this.addBreadcrumb();
	}

	onShowefyComplete(event) {
		// console.log('ProductsConfigureComponent.onShowefyComplete', event);
		if (this.isConfiguring) {
			this.isComplete = true;
		}
	}

	onStartConfigurator(event) {
		// console.log('ProductsConfigureComponent.onStartConfigurator', event);
		this.isConfiguring = true;
	}

	onButtonPressed(event) {
		// console.log('ProductsConfigureComponent.onButtonPressed', event, 'buttonId', event.data.id);
		switch (event.data.id) {
			case 'order':
				this.sfy.getProductExtData();
				break;
		}
	}

	onSetButtonStatus(event) {
		console.log('ProductsConfigureComponent.onSetButtonStatus', event);
	}

	onGetIframeSize(event) {
		console.log('ProductsConfigureComponent.onGetIframeSize', event);
	}

	onGetProductExtData(event) {
		console.log('ProductsConfigureComponent.onGetProductExtData', event.status, event.data);
		if (event.status === 0) {
			this.onAddToCart(event.data);
		}
	}

	onGetFastProductExtData(event) {
		console.log('ProductsConfigureComponent.onGetFastProductExtData', event.status, event.data);
		if (event.status === 0) {
			this.onAddToCart(event.data);
		}
	}

	// methods

	addTexts() {
		const sfy = this.sfy;
		const html = sfy.HTML;
		let index = 0;
		html.text[index++] = /* html */`<h1 style="${titleStyle}">Nome Prodotto</h1>`;
		html.text[index++] = /* html */`<h5 style="${designerStyle}">Designer</h5>`;
		html.text[index++] = /* html */`<div style="${descriptionStyle}"><p>Descrizione</p></div>`;
		sfy.printHTML(html);
	}

	addButtons() {
		const sfy = this.sfy;
		const buttons = sfy.BUTTONS;

		let index = 0;
		buttons.element[index] = new sfy.PROPERTIES();
		buttons.element[index].visibility = true;
		buttons.element[index].id = 'order';
		buttons.element[index].label = new sfy.LABEL();
		buttons.element[index].label.it = 'Aggiungi al carrello';
		buttons.element[index].label.en = 'Add to cart';
		index++;

		/*
		buttons.element[index] = new sfy.PROPERTIES();
		buttons.element[index].visibility = true;
		buttons.element[index].id = 'save_configuration';
		buttons.element[index].label = new sfy.LABEL();
		buttons.element[index].label.en = 'SAVE CONFIGURATION';
		index++;
		*/

		sfy.setButtonStatus(buttons);
	}

	addBreadcrumb() {
		const sfy = this.sfy;
		const breadcrumb = sfy.BREADCUMB;

		let index = 0;

		breadcrumb.element[index] = new sfy.PROPERTIES();
		breadcrumb.element[index].visibility = true;
		breadcrumb.element[index].id = 'breadcumb_home';
		breadcrumb.element[index].label = new sfy.LABEL();
		breadcrumb.element[index].label.en = /* html */` Home <span aria-hidden='true'>/</span>&nbsp; `;
		breadcrumb.element[index].style = breadcumbStyle;
		index++;

		breadcrumb.element[index] = new sfy.PROPERTIES();
		breadcrumb.element[index].visibility = true;
		breadcrumb.element[index].id = 'breadcumb_products';
		breadcrumb.element[index].label = new sfy.LABEL();
		breadcrumb.element[index].label.en = /* html */` Products <span aria-hidden='true'>/</span>&nbsp; `;
		breadcrumb.element[index].style = breadcumbStyle;
		index++;

		breadcrumb.element[index] = new sfy.PROPERTIES();
		breadcrumb.element[index].visibility = true;
		breadcrumb.element[index].id = 'breadcumb_products';
		breadcrumb.element[index].label = new sfy.LABEL();
		breadcrumb.element[index].label.en = /* html */` Nome prodotto`;
		breadcrumb.element[index].style = breadcumbStyle;
		index++;

		sfy.printBreadcumb(breadcrumb);
	}

	onAddToCart(data) {
		const cartItem = this.product;
		cartItem.showefy = data;
		if (data.product_code) {
			cartItem.code = data.product_code;
		}
		if (data.image) {
			cartItem.image = data.image;
		}
		cartItem.title = `${cartItem.productTitle} ${cartItem.code}`;
		console.log('ProductsConfigureComponent.onAddToCart', cartItem);
		// resetting purchase procedure
		CartService.setCart(null);
		// getting showefy price and adding to mini cart
		CartMiniService.getPriceAndAddItem$(cartItem).pipe(
			first(),
		).subscribe();
	}
}

ProductsConfigureComponent.meta = {
	selector: '[products-configure]',
	inputs: ['token', 'product'],
};
