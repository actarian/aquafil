import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

export class EllipsisDirective extends Directive {

	onInit() {
		const { node } = getContext(this);
		this.originalText = node.innerText;
		this.resize$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();
	}

	resize$() {
		const { node } = getContext(this);
		return fromEvent(window, 'resize').pipe(
			startWith(_ => null),
			tap(_ => {
				let text = this.originalText;
				node.innerText = text;
				while (node.scrollHeight - node.offsetHeight > 0) {
					const words = text.split(' ');
					words.pop();
					text = `${words.join(' ')}...`;
					node.innerText = text;
					// console.log(node.scrollHeight, node.offsetHeight);
				}
			}),
		);
	}

}

EllipsisDirective.meta = {
	selector: '[ellipsis]',
};
