import { CoreModule, Module } from 'rxcomp';
import { FormModule } from 'rxcomp-form';
import { AppComponent } from './app.component';
import { CommonModule } from './common/common.module';
import { ControlsModule } from './controls/controls.module';
import { CardProductDetailComponent } from './pages/card-product-detail/card-product-detail.component';
import { ContactModalComponent } from './pages/contact-modal/contact-modal.component';
import { OpenModallyDirective } from './pages/open-modally/open-modally.directive';
import { SideModalComponent } from './pages/side-modal/side-modal.component';
import { SharedModule } from './shared/shared.module';

export class AppModule extends Module { }

AppModule.meta = {
	imports: [
		CoreModule,
		FormModule,
		CommonModule,
		ControlsModule,
		SharedModule,
	],
	declarations: [
		ContactModalComponent,
		CardProductDetailComponent,
		OpenModallyDirective,
		SideModalComponent,
	],
	bootstrap: AppComponent,
};
