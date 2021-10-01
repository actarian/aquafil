import { Directive, getContext } from 'rxcomp';

export class NameDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		node.setAttribute('name', this.name);
	}

}

NameDirective.meta = {
	selector: '[[name]]',
	inputs: ['name']
};
