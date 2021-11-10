import { Module } from 'rxcomp';
import { AltDirective } from './alt/alt.directive';
import { AppearDirective } from './appear/appear.directive';
import { ClickOutsideDirective } from './click-outside/click-outside.directive';
import { DatePipe } from './date/date.pipe';
import { DownloadDirective } from './download/download.directive';
import { DropdownItemDirective } from './dropdown/dropdown-item.directive';
import { DropdownDirective } from './dropdown/dropdown.directive';
import { EllipsisDirective } from './ellipsis/ellipsis.directive';
import { EnvPipe } from './env/env.pipe';
import { FilterItemComponent } from './filter/filter-item.component';
import { FlagPipe } from './flag/flag.pipe';
import { GalleryModalComponent } from './gallery/gallery-modal.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HighlightPipe } from './highlight/highlight.pipe';
import { HtmlPipe } from './html/html.pipe';
import { IdDirective } from './id/id.directive';
import { LabelForDirective } from './label-for/label-for.directive';
import { LabelPipe } from './label/label.pipe';
import { ModalOutletComponent } from './modal/modal-outlet.component';
import { NameDirective } from './name/name.directive';
import { NumberPipe } from './number/number.pipe';
import { RelativeDatePipe } from './relative-date/relative-date.pipe';
import { ScrollMenuDirective } from './scroll-menu/scroll-menu.directive';
import { ScrollToDirective } from './scroll-to/scroll-to.directive';
import { ScrollStickyDirective } from './scroll/scroll-sticky.directive';
import { ScrollDirective } from './scroll/scroll.directive';
import { ShareDirective } from './share/share.directive';
import { SlugPipe } from './slug/slug.pipe';
import { SvgIconStructure } from './svg/svg-icon.structure';
import { SwiperDirective } from './swiper/swiper.directive';
import { ThronComponent } from './thron/thron.component';
import { TitleDirective } from './title/title.directive';
import { ToggleDirective } from './toggle/toggle.directive';

const factories = [
	AltDirective,
	AppearDirective,
	ClickOutsideDirective,
	DownloadDirective,
	// DropDirective,
	DropdownDirective,
	DropdownItemDirective,
	// DropdownItemDirective,
	EllipsisDirective,
	FilterItemComponent,
	GalleryComponent,
	GalleryModalComponent,
	IdDirective,
	LabelForDirective,
	// LanguageComponent,
	// LazyDirective,
	// ModalComponent,
	ModalOutletComponent,
	NameDirective,
	ScrollDirective,
	ScrollStickyDirective,
	ScrollToDirective,
	ScrollMenuDirective,
	ShareDirective,
	SvgIconStructure,
	SwiperDirective,
	ThronComponent,
	TitleDirective,
	ToggleDirective,
	// UploadItemComponent,
	// VirtualStructure
];

const pipes = [
	DatePipe,
	EnvPipe,
	FlagPipe,
	HighlightPipe,
	HtmlPipe,
	LabelPipe,
	NumberPipe,
	RelativeDatePipe,
	SlugPipe,
];

export class CommonModule extends Module { }

CommonModule.meta = {
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
