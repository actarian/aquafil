import { Component, getContext } from 'rxcomp';
import { takeUntil } from 'rxjs/operators';
import { ScrollService } from './common/scroll/scroll.service';

export class AppComponent extends Component {

	onInit() {
		const { node } = getContext(this);
		node.classList.remove('hidden');
		console.log('AppComponent.onInit');
		ScrollService.init$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();
	}
}

AppComponent.meta = {
	selector: '[app-component]',
};
