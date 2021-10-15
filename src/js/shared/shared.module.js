import { Module } from 'rxcomp';
import { OpenModallyDirective } from '../pages/open-modally/open-modally.directive';
import { SideModalComponent } from '../pages/side-modal/side-modal.component';
import { SwiperMainDirective } from '../partials/swiper-main/swiper-main.directive';
import { SwiperToolkitDirective } from '../partials/swiper-toolkit/swiper-toolkit.directive';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { NewsletterPropositionComponent } from './newsletter-proposition/newsletter-proposition.component';
import { SwitchComponent } from './switch/switch.component';
import { UserDeleteComponent } from './user/user-delete.component';
import { UserDetailComponent } from './user/user-detail.component';
import { UserEditPasswordComponent } from './user/user-edit-password.component';
import { UserEditComponent } from './user/user-edit.component';
import { UserForgotComponent } from './user/user-forgot.component';
import { UserModalComponent } from './user/user-modal.component';
import { UserSigninComponent } from './user/user-signin.component';
import { UserSignupComponent } from './user/user-signup.component';
import { UserComponent } from './user/user.component';

const factories = [
	ErrorComponent,
	HeaderComponent,
	NewsletterPropositionComponent,
	OpenModallyDirective,
	SideModalComponent,
	SwiperMainDirective,
	SwiperToolkitDirective,
	SwitchComponent,
	UserComponent,
	UserDeleteComponent,
	UserEditComponent,
	UserEditPasswordComponent,
	UserForgotComponent,
	UserModalComponent,
	UserDetailComponent,
	UserSigninComponent,
	UserSignupComponent,
];

const pipes = [
];

export class SharedModule extends Module { }

SharedModule.meta = {
	imports: [
	],
	declarations: [
		...factories,
		...pipes,
	],
	exports: [
		...factories,
		...pipes,
	],
};
