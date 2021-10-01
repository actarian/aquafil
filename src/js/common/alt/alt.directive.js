import { Directive, getContext } from 'rxcomp';

export class AltDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		node.setAttribute('alt', this.alt);
	}

}

AltDirective.meta = {
	selector: '[[alt]]',
	inputs: ['alt']
};
