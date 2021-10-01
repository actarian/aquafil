import { Component } from 'rxcomp';
import { combineLatest } from 'rxjs';
import { first, takeUntil, tap } from 'rxjs/operators';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { UserService } from './user.service';

export class UserDetailComponent extends Component {

	get countryName() {
		let countryName = null;
		if (this.user && this.countries.length) {
			const country = this.countries.find(x => x.value === this.user.country);
			if (country) {
				countryName = country.label;
			}
		}
		return countryName;
	}

	get occupationName() {
		let occupationName = null;
		if (this.user && this.occupations.length) {
			const occupation = this.occupations.find(x => x.value === this.user.occupation);
			if (occupation) {
				occupationName = occupation.label;
			}
		}
		return occupationName;
	}

	get newsletterLanguageName() {
		let newsletterLanguageName = null;
		if (this.user && this.newsletterLanguages.length) {
			const newsletterLanguage = this.newsletterLanguages.find(x => x.value === this.user.newsletterLanguage);
			if (newsletterLanguage) {
				newsletterLanguageName = newsletterLanguage.label;
			}
		}
		return newsletterLanguageName;
	}

	onInit() {
		this.countries = [];
		this.occupations = [];
		this.newsletterLanguages = [];
		this.gdpr = [];
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(user => {
			this.user = user;
			this.pushChanges();
		});
		this.load$().pipe(
			first(),
			takeUntil(this.unsubscribe$)
		).subscribe();
	}

	load$() {
		return combineLatest([
			UserService.data$(),
			UserService.gdpr$(),
		]).pipe(
			tap(datas => {
				const data = datas[0];
				this.countries = data.country.options;
				this.occupations = data.occupation.options;
				this.newsletterLanguages = data.newsletterLanguage.options;
				const gdpr = datas[1];
				this.gdpr = gdpr;
				this.pushChanges();
			})
		);
	}

	onModalUserUpdate(event) {
		// console.log('UserDetailComponent.onModalUserUpdate');
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 4 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('UserDetailComponent.onModalSignUp', event);
		});
	}

	onModalGdpr(legalNote) {
		// console.log('UserDetailComponent.onModalUserUpdate');
		ModalService.open$({ src: environment.template.modal.genericModal, data: { title: legalNote.title, description: legalNote.description } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			// console.log('UserDetailComponent.onModalGdpr', event);
		});
	}
}

UserDetailComponent.meta = {
	selector: '[user-detail]',
};
