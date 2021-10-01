import { Component, getContext } from 'rxcomp';
import { FormControl, FormGroup, Validators } from 'rxcomp-form';
import { combineLatest, of } from 'rxjs';
import { finalize, first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { FacebookService } from '../../common/facebook/facebook.service';
import { GoogleService } from '../../common/google/google.service';
import { GoogleMapsService } from '../../common/googlemaps/googlemaps.service';
import { LinkedinService } from '../../common/linkedin/linkedin.service';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalResolveEvent, ModalService } from '../../common/modal/modal.service';
import { FormService } from '../../controls/form.service';
import RequiredIfValidator from '../../controls/required-if.validator';
import { environment } from '../../environment';
import { CartMiniService } from '../../shared/cart-mini/cart-mini.service';
import { UserService } from '../../shared/user/user.service';
import { OrdersService } from '../orders/orders.service';
import { CartService, CartSteps } from './cart.service';

export class CartComponent extends Component {

	get totalPrice() {
		const items = this.items || [];
		let total = items.reduce((p, c, i) => {
			return p + c.price.price * c.qty;
		}, 0);
		if (this.delivery) {
			total += this.delivery.price;
		}
		if (this.discount) {
			total += this.discount.price;
		}
		return total;
	}

	get selectedStore() {
		if (!this.controls || !this.controls.stores || !this.controls.stores.value) {
			return null;
		} else {
			return this.controls.stores.value.find(x => x.id === this.controls.store.value);
		}
	}

	get shipmentCountriesLabel() {
		let shipmentCountriesLabel = '';
		shipmentCountriesLabel = this.shipmentCountryOptions.map(x => x.label).join(', ');
		return shipmentCountriesLabel;
	}

	onInit() {
		this.steps = CartSteps;
		this.step = CartSteps.None;
		this.detectSocialLogin();
		this.checkPaymentParams();
	}

	checkPaymentParams() {
		const urlSearchParams = new URLSearchParams(window.location.search);
		const params = Object.fromEntries(urlSearchParams.entries());
		if (params.id != null) {
			this.onComplete(params);
		} else {
			this.load$().pipe(
				first(),
			).subscribe();
		}
	}

	load$() {
		return combineLatest([CartService.data$()]).pipe(
			tap(results => {
				const data = results[0];
				this.initWithData(data);
			}),
		);
	}

	initWithData(data) {
		this.errorDelivery = null;
		this.errorDiscount = null;
		this.errorPayment = null;
		this.error = false;
		this.success = false;
		this.estimatedDelivery = null;
		this.items = null;
		this.items$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(items => {
			this.items = items;
			this.pushChanges();
		});
		this.socialBusy = false;
		this.user = null;
		this.guest = null;
		this.shipmentCountryOptions = [];
		this.countryOptions = [];
		this.deliveryData = null;
		this.billingData = null;
		this.delivery = null;
		this.discount = null;
		this.paymentMethod = null;
		const form = this.form = new FormGroup({
			step: this.step,
			items: null,
			shipmentCountry: new FormControl(114, [Validators.RequiredValidator()]),
			user: null,
			guest: null,
			data: new FormGroup({
				firstName: new FormControl(null, [Validators.RequiredValidator()]),
				lastName: new FormControl(null, [Validators.RequiredValidator()]),
				email: new FormControl(null, [Validators.RequiredValidator(), Validators.EmailValidator()]),
				telephone: new FormControl(null, [Validators.RequiredValidator()]),
				address: new FormControl(null, [Validators.RequiredValidator()]),
				zipCode: new FormControl(null, [Validators.RequiredValidator()]),
				city: new FormControl(null, [Validators.RequiredValidator()]),
				province: new FormControl(null, [Validators.RequiredValidator()]),
				country: new FormControl(null, [Validators.RequiredValidator()]),
				message: null,
				invoice: null,
				invoiceData: new FormGroup({
					taxNumber: new FormControl(null, [RequiredIfValidator('invoice', getDataGroup)]),
					sdi: new FormControl(null, [RequiredIfValidator('invoice', getDataGroup)]),
					pec: new FormControl(null, [RequiredIfValidator('invoice', getDataGroup)]),
				}),
				billing: null,
				billingData: new FormGroup({
					company: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					firstName: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					lastName: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					telephone: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					address: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					zipCode: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					city: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					province: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
					country: new FormControl(null, [RequiredIfValidator('billing', getDataGroup)]),
				}),
				conditions: new FormControl(null, [Validators.RequiredTrueValidator()]),
				privacy: new FormControl(null, [Validators.RequiredTrueValidator()]),
				newsletter: new FormControl(null, [Validators.RequiredValidator()]),
				commercial: new FormControl(null, [Validators.RequiredValidator()]),
				promotion: new FormControl(null, [Validators.RequiredValidator()]),
				// terms: null,
			}),
			deliveryData: null,
			billingData: null,
			deliveryType: new FormControl(null, [Validators.RequiredValidator()]),
			delivery: null,
			discountCode: null,
			discount: null,
			paymentMethod: new FormControl(null, [Validators.RequiredValidator()]),
			stores: null,
			store: new FormControl(null, [Validators.RequiredValidator()]),
			checkRequest: window.antiforgery,
			checkField: '',
		});
		const controls = this.controls = form.controls;
		function getDataGroup() {
			// console.log(form.controls.data);
			return form.controls.data;
		}
		form.changes$.pipe(
			takeUntil(this.unsubscribe$)
		).subscribe((_) => {
			// console.log('form', form.value);
			this.pushChanges();
			LocomotiveScrollService.update();
		});

		/*
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(user => this.onUser(user));
		*/

		const sortCountry = (a, b) => {
			if (a.label.toLowerCase() === 'italia') {
				return -1;
			} else if (b.label.toLowerCase() === 'italia') {
				return 1;
			} else {
				return a.label - b.label;
			}
		};

		let shipmentCountryOptions = data.shipmentCountry.options.slice();
		shipmentCountryOptions.sort(sortCountry);
		this.shipmentCountryOptions = shipmentCountryOptions;
		controls.shipmentCountry.options = FormService.toSelectOptions(this.shipmentCountryOptions);
		controls.data.controls.country.options = FormService.toSelectOptions(this.shipmentCountryOptions);

		let countryOptions = data.country.options.slice();
		countryOptions.sort(sortCountry);
		this.countryOptions = countryOptions;
		controls.data.controls.billingData.controls.country.options = FormService.toSelectOptions(this.countryOptions);

		/*
		controls.deliveryType.options = data.deliveryType.options.slice().map(x => ({
			id: x.value,
			name: x.label,
			abstract: x.abstract,
			description: x.description,
			price: x.price,
			fullPrice: x.fullPrice,
		}));
		*/
		controls.paymentMethod.options = data.paymentMethod.options.slice().map(x => ({
			id: x.value,
			name: x.label,
			description: x.description,
			info: x.info,
			icons: x.icons,
		}));
		this.form.patch({
			shipmentCountry: controls.shipmentCountry.options[1].id,
			// deliveryType: controls.deliveryType.options[0].id,
			paymentMethod: controls.paymentMethod.options[0].id,
		}, true);
		this.pushChanges();

		CartService.cart$().pipe(
			first(),
		).subscribe(cart => {
			if (cart) {
				this.step = cart.step;
				this.guest = cart.guest;
				this.deliveryData = cart.deliveryData;
				this.billingData = cart.billingData;
				this.delivery = cart.delivery;
				this.discount = cart.discount;
				this.paymentMethod = cart.paymentMethod;
				if (cart.stores) {
					controls.store.options = cart.stores.slice().map(x => ({
						id: x.id,
						name: x.name,
						address: x.address,
						city: x.city,
						country: x.country,
						distance: x.distance,
					}));
				}
			} else {
				this.step = CartSteps.Items;
			}
			this.onPatch(cart, true);
		});
	}

	touchForm() {
		this.form.touched = true;
		const { node } = getContext(this);
		const firstInvalidInput = Array.prototype.slice.call(node.querySelectorAll('.invalid')).find((x) => x.hasAttribute('[control]'));
		if (firstInvalidInput) {
			LocomotiveScrollService.scrollTo(firstInvalidInput, { offset: -260, duration: 0, disableLerp: true });
		}
	}

	onBack() {
		this.step--;
		let patch = null;
		if (this.step === CartSteps.Items) {
			this.user = null;
			this.guest = false;
			patch = { user: null, guest: false };
		}
		this.onPatch(patch);
	}

	onNext(patch) {
		this.step++;
		this.onPatch(patch);
	}

	onPatch(patch = {}, skipUpdate = false) {
		this.form.patch(Object.assign({}, patch, { step: this.step }));
		switch (this.step) {
			case CartSteps.Delivery:
				this.busy = true;
				this.errorDelivery = null;
				this.getDeliveryType$().pipe(
					first(),
					finalize(_ => {
						this.busy = false;
						this.pushChanges();
					}),
				).subscribe(_ => {
					this.onAfterPatch(skipUpdate);
				}, errorDelivery => {
					// console.log('errorDelivery', errorDelivery);
					this.errorDelivery = errorDelivery;
					this.onAfterPatch(true);
				});
				break;
			default:
				this.onAfterPatch(skipUpdate);
		}
	}

	onAfterPatch(skipUpdate = false) {
		this.pushChanges();
		LocomotiveScrollService.update();
		const target = document.querySelector('.section--breadcrumb');
		LocomotiveScrollService.scrollTo(target, { offset: -130, duration: 0, disableLerp: true });
		if (!skipUpdate) {
			CartService.setCart(this.form.value);
		}
	}

	// 1. CartSteps.Items
	onItems(_) {
		UserService.me$().pipe(
			first(),
		).subscribe(user => {
			this.onUser(user);
			this.onNext({
				items: this.items,
			});
		});
		/*
		this.onNext({
			items: this.items,
		});
		*/
	}

	onIncrement(item) {
		CartMiniService.incrementItem$(item).pipe(
			first(),
		).subscribe();
	}

	onDecrement(item) {
		CartMiniService.decrementItem$(item).pipe(
			first(),
		).subscribe();
	}

	onRemove(item) {
		CartMiniService.removeItem$(item).pipe(
			first(),
		).subscribe();
	}

	onEdit(item) {
		// console.log('CartComponent.onEdit', item);
		if (environment.flags.production) {
			window.location.href = `${item.url}/config?productId=${item.id}&code=${item.code}${item.showefy ? `&sl=${item.showefy.product_link.split('&sl=')[1]}` : ''}`;
		} else {
			window.location.href = `${environment.slug.configureProduct}?productId=${item.id}&code=${item.code}${item.showefy ? `&sl=${item.showefy.product_link.split('&sl=')[1]}` : ''}`;
		}
	}

	items$() {
		return CartMiniService.items$().pipe(
			switchMap(items => {
				if (items.length) {
					return CartService.estimatedDelivery$({ items }).pipe(
						map(data => {
							this.estimatedDelivery = data.estimatedDelivery;
							return items;
						}),
					);
				} else {
					this.estimatedDelivery = null;
					return of(items);
				}
			}),
		);
	}

	// 2. CartSteps.Data
	onModalSignIn() {
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 1 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('CartComponent.onModalSignIn', event);
			if (event instanceof ModalResolveEvent) {
				this.onUser(event.data);
			}
		});
	}

	onModalSignUp(me) {
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 2, me } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('CartComponent.onModalSignUp', event);
			if (event instanceof ModalResolveEvent) {
				this.onUser(event.data);
			}
		});
	}

	onUser(user) {
		// console.log('CartComponent.onUser', user);
		if (user) {
			this.user = user;
			this.guest = false;
			this.onPatch({
				user: user,
				data: {
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					// telephone: null,
					// address: null,
					// zipCode: null,
					city: user.city,
					// province: null,
					country: user.country,
					privacy: user.privacy,
				}
			});
		}
	}

	onGuest() {
		this.user = null;
		this.guest = true;
		this.onPatch({ user: null, guest: true });
	}

	onFacebookLogout() {
		FacebookService.logout$().pipe(
			first(),
		).subscribe();
	}

	onSocialLogin(social) {
		switch (social) {
			case 'facebook':
				this.onFacebookLogin();
				break;
			case 'google':
				this.onGoogleLogin();
				break;
			case 'linkedin':
				this.onLinkedinLogin();
				break;
		}
		return;
	}

	onFacebookLogin() {
		console.log('onFacebookLogin');
		this.socialBusy = 'facebook';
		let socialMe;
		function mapMe(data) {
			// console.log(data);
			/*
			authResponse:
				accessToken: string
				data_access_expiration_time: 1633594543
				expiresIn: 5164299
				graphDomain: "facebook"
				signedRequest: string
				userID: string
			email: string
			facebookToken: string
			first_name: string
			id: string
			last_name: string
			name: string
			picture:
				data:
					height: 50
					is_silhouette: false
					url: string
					width: 50
			*/
			const me = {};
			if (data) {
				me.firstName = data.first_name;
				me.lastName = data.last_name;
				me.email = data.email;
				me.socialPicture = data.picture.data.url;
				me.socialType = 'facebook';
				me.socialId = data.id;
				me.socialToken = data.facebookToken;
				me.socialTokenExpiresAt = data.authResponse.data_access_expiration_time;
			}
			console.log('CartComponent.onFacebookLogin.mapMe', me);
			return me;
		}
		FacebookService.me$().pipe(
			first(),
			tap(me => socialMe = me),
			switchMap(me => UserService.tryFacebook$(me)),
			finalize(() => this.socialBusy = false),
		).subscribe(user => {
			if (user) {
				this.onUser(user);
			} else {
				const me = mapMe(socialMe);
				this.onModalSignUp(me);
			}
		}, error => {
			console.log('CartComponent.onFacebookLogin.error', error);
			const me = mapMe(socialMe);
			this.onModalSignUp(me);
		});
	}

	onGoogleLogin() {
		this.socialBusy = 'google';
		let socialMe;
		function mapMe(data) {
			// console.log(data);
			/*
			authResponse:
				access_token: string
				expires_at: 1625838392809
				expires_in: 3599
				first_issued_at: 1625834793809
				id_token: string
				idpId: "google"
				login_hint: string
				scope: "email profile openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile"
				session_state: {extraQueryParams: {…}}
				token_type: "Bearer"
			email: string
			firstName: string
			googleToken: string
			id: string
			lastName: string
			name: string
			picture: string
			*/
			const me = {};
			if (data) {
				me.firstName = data.firstName;
				me.lastName = data.lastName;
				me.email = data.email;
				me.socialPicture = data.picture;
				me.socialType = 'google';
				me.socialId = data.id;
				me.socialToken = data.googleToken;
				me.socialTokenExpiresAt = data.authResponse.expires_at;
			}
			console.log('CartComponent.onGoogleLogin.mapMe', me);
			return me;
		}
		GoogleService.me$().pipe(
			first(),
			tap(me => socialMe = me),
			switchMap(me => UserService.tryGoogle$(me)),
			finalize(() => this.socialBusy = false),
		).subscribe(user => {
			if (user) {
				this.onUser(user);
			} else {
				const me = mapMe(socialMe);
				this.onModalSignUp(me);
			}
		}, error => {
			console.log('CartComponent.onGoogleLogin.error', error);
			const me = mapMe(socialMe);
			this.onModalSignUp(me);
		});
	}

	onLinkedinLogin() {
		LinkedinService.linkedin$().pipe(
			first(),
		).subscribe(token => {
			console.log('CartComponent.onLinkedinLogin', token);
			this.onModalSignUp({ firstName: 'Luca' });
		}, error => {
			console.log('CartComponent.onLinkedinLogin.error', error);
			const me = mapMe(socialMe);
			this.onModalSignUp(me);
		});
	}

	detectSocialLogin() {
		if (window.name === 'linkedin' && window.opener) {
			const urlSearchParams = new URLSearchParams(window.location.search);
			const params = Object.fromEntries(urlSearchParams.entries());
			// console.log('window', window.name, params);
			if (typeof window.opener.onSocialCallback === 'function') {
				window.opener.onSocialCallback(window.name, params);
			}
			self.close();
		}
	}

	onData(_) {
		const form = this.form;
		// const controls = this.controls;
		// console.log('CartComponent.onData', form.controls.data.valid);
		if (form.controls.data.valid) {
			const deliveryData = form.value.data;
			const deliveryCountry = this.getCountryById(deliveryData.country);
			const onGeocoder = (latitude = null, longitude = null) => {
				deliveryData.latitude = latitude;
				deliveryData.longitude = longitude;
				this.deliveryData = Object.assign({}, deliveryData, {
					country: deliveryCountry,
				});
				const billingData = (form.value.data.billing ? form.value.data.billingData : form.value.data);
				const billingCountry = this.getCountryById(billingData.country);
				this.billingData = Object.assign({}, billingData, {
					country: billingCountry,
				});
				// console.log('CartComponent.onData.onGeocoder', latitude, longitude);
				this.onNext({ deliveryData, billingData });
			}
			let latitude = null, longitude = null;
			GoogleMapsService.geocode$({ address: `${deliveryData.address}, ${deliveryData.zipCode} ${deliveryData.city} ${deliveryCountry.name}` }).pipe(
				first(),
			).subscribe(results => {
				if (results.length) {
					// console.log('CartComponent.onData.geocode', results);
					const location = results[0].geometry.location;
					latitude = location.lat();
					longitude = location.lng();
				}
				onGeocoder(latitude, longitude);
			}, error => {
				onGeocoder(latitude, longitude);
			});
		} else {
			this.touchForm();
		}
	}

	getCountryById(countryId) {
		return FormService.toSelectOptions(this.countryOptions).find(x => x.id === countryId);
	}

	testData() {
		const form = this.form;
		const controls = this.controls;
		const country = controls.data.controls.country.options.length > 1 ? controls.data.controls.country.options[1].id : null;
		form.patch({
			data: {
				firstName: 'Jhon',
				lastName: 'Appleseed',
				email: 'jhonappleseed@gmail.com',
				telephone: '0721 411112',
				address: 'Strada della Campanara, 15',
				zipCode: '61122',
				city: 'Pesaro',
				province: 'Pesaro',
				country: country,
				message: 'Hi!',
				conditions: true,
				privacy: true,
				newsletter: false,
				commercial: false,
				promotion: false,
				// terms: false,
			},
			checkRequest: window.antiforgery,
			checkField: ''
		});
	}

	resetData() {
		const data = this.controls.data;
		data.reset();
	}

	// 3. CartSteps.Delivery
	onDelivery(_) {
		const form = this.form;
		const controls = this.controls;
		const delivery = controls.deliveryType.options.find(x => x.id === form.value.deliveryType);
		this.delivery = delivery;
		// console.log('CartComponent.onDelivery', form.value);
		CartService.getStores$(form.value).pipe(
			first(),
		).subscribe(stores => {
			controls.stores.value = stores;
			controls.store.options = stores.slice().map(x => ({
				id: x.id,
				name: x.name,
				address: x.address,
				city: x.city,
				country: x.country,
				distance: x.distance,
			}));
			const store = stores[0];
			const storeId = store ? store.id : null;
			this.onNext({ stores, store: storeId, delivery });
		});
	}

	getDeliveryType$() {
		return CartService.getDeliveryType$(this.form.value).pipe(
			tap(deliveryTypeOptions => {
				const controls = this.controls;
				controls.deliveryType.options = deliveryTypeOptions.slice().map(x => ({
					id: x.value,
					name: x.label,
					abstract: x.abstract,
					description: x.description,
					price: x.price,
					fullPrice: x.fullPrice,
				}));
				this.form.patch(Object.assign({}, { deliveryType: controls.deliveryType.options[0].id }), true);
			}),
		);
	}

	// 4. CartSteps.Recap
	onDiscountCode(_) {
		const form = this.form;
		// console.log('CartComponent.onDelivery', form.value);
		this.errorDiscount = null;
		//CartService.getDiscount$({ discountCode: form.value.discountCode }).pipe(
		CartService.getDiscount$(form.value).pipe(
			first(),
		).subscribe(discount => {
			this.discount = discount;
			this.onPatch({ discount });
		}, errorDiscount => {
			this.errorDiscount = errorDiscount;
		});
	}

	onTimetableToggle(event) {
		if (this.selectedStore) {
			this.selectedStore.showTimetable = !this.selectedStore.showTimetable;
			this.pushChanges();
		}
	}

	// 5. CartSteps.Payment
	onPayment(_) {
		const form = this.form;
		const controls = this.controls;
		const paymentMethod = controls.paymentMethod.options.find(x => x.id === form.value.paymentMethod);
		this.paymentMethod = paymentMethod;
		if (form.valid) {
			console.log('CartComponent.onPayment', form.value);
			CartService.doPayment$(form.value).pipe(
				first(),
			).subscribe(response => {
				if (environment.flags.production) {
					window.location.href = response.redirectUrl;
				} else {
					this.onComplete({ id: 444, mp: 5, result: 1, transactionId: 'WEBSOLUTE27' }); // !!! only on development
				}
			});
		}
	}

	// 6. CartSteps.Complete
	onComplete(params) {
		// ?id=27&mp=5&result=1&transactionid=WEBSOLUTE27
		this.step = CartSteps.Complete;
		this.success = params.result === '1';
		this.error = params.result === '-1';
		this.paymentMethodId = params.mp;
		this.transactionId = params.transactionId;
		this.orderId = params.id;
		this.order = null;
		if (this.success) {
			this.orderBusy = true;
			CartMiniService.setItems([]);
			CartService.setCart(null);
			OrdersService.detail$(this.orderId).pipe(
				first(),
				tap(order => {
					this.order = order;
				}),
				finalize(_ => {
					this.orderBusy = false;
					this.pushChanges();
				}),
			).subscribe();
		}
		// this.onPatch();
	}

	onOpenOrder(orderId) {
		ModalService.open$({ src: environment.template.modal.ordersModal, data: { orderId: orderId } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('CartComponent.onOpenOrder', event);
		});
	}
}

CartComponent.meta = {
	selector: '[cart]',
};
