import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { UserService, UserViews } from './user.service';

export class UserComponent extends Component {

	onInit() {
		this.views = UserViews;
		this.view = this.view || UserViews.SIGN_UP;
	}

	onModalSignIn(event) {
		// console.log('UserComponent.onModalSignIn');
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 1 } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('UserComponent.onModalSignIn', event);
		});
	}

	onModalSignUp(event) {
		// console.log('UserComponent.onModalSignUp');
		ModalService.open$({ src: environment.template.modal.userModal, data: { view: 2, skipAutoClose: true } }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('UserComponent.onModalSignUp', event);
		});
	}

	setView(view) {
		this.view = view;
		this.pushChanges();
		const { node } = getContext(this);
		LocomotiveScrollService.scrollTo(node, { offset: -100 });
	}

	onViewSignIn(event) {
		// console.log('UserComponent.onViewSignIn');
		this.setView(UserViews.SIGN_IN);
	}

	onViewSignUp(event) {
		// console.log('UserComponent.onViewSignIn');
		this.setView(UserViews.SIGN_UP);
	}

	onViewForgot(event) {
		// console.log('UserComponent.onViewForgot');
		this.setView(UserViews.FORGOTTEN);
	}

	onSignIn(user) {
		console.log('UserComponent.onSignIn', user);
		UserService.setUser(user);
		if (this.navTo) {
			window.location.href = this.navTo;
		}
		// nav to profile
	}

	onSignUp(user) {
		console.log('UserComponent.onSignUp', user);
		UserService.setUser(user);
		if (this.navTo) {
			window.location.href = this.navTo;
		}
		// nav to profile
	}

	onForgot(email) {
		/*
		console.log('UserComponent.onForgot', email);
		this.setView(UserViews.SIGN_IN);
		*/
	}
}

UserComponent.meta = {
	selector: '[user]',
	inputs: ['navTo', 'view']
};
