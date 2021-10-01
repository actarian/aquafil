import { getContext } from 'rxcomp';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalOutletComponent } from '../../common/modal/modal-outlet.component';
import { ModalService } from '../../common/modal/modal.service';
import { UserComponent } from './user.component';
import { UserViews } from './user.service';

export class UserModalComponent extends UserComponent {

	onInit() {
		super.onInit();
		const { parentInstance } = getContext(this);
		if (parentInstance instanceof ModalOutletComponent) {
			const data = parentInstance.modal.data;
			this.view = data.view;
			this.me = data.me;
			this.skipAutoClose = data.skipAutoClose;
			// console.log('UserModalComponent.onInit', data);
		}
		LocomotiveScrollService.stop();
	}

	setView(view) {
		this.view = view;
		this.pushChanges();
		const { node } = getContext(this);
		const target = window.innerWidth >= 1024 ? node.querySelector('.modal__inner') : node;
		target.scrollTo(0, 0);
	}

	onViewForgot() {
		console.log('UserModalComponent.onViewForgot');
		this.setView(UserViews.FORGOTTEN);
	}

	onViewSignIn() {
		console.log('UserModalComponent.onViewSignIn');
		this.setView(UserViews.SIGN_IN);
	}

	onViewSignUp() {
		console.log('UserModalComponent.onViewSignUp');
		this.setView(UserViews.SIGN_UP);
	}

	onClose() {
		ModalService.reject();
	}

	onSignUp(user) {
		// console.log('UserModalComponent.onSignUp', user);
		if (!this.skipAutoClose) {
			ModalService.resolve(user);
		}
	}

	onSignIn(user) {
		// console.log('UserModalComponent.onSignIn', user);
		ModalService.resolve(user);
	}

	onDestroy() {
		LocomotiveScrollService.start();
	}
}

UserModalComponent.meta = {
	selector: '[user-modal]'
};
