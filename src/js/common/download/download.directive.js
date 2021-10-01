import { Directive, getContext } from 'rxcomp';

export class DownloadDirective extends Directive {

	onChanges() {
		const { node } = getContext(this);
		node.setAttribute('download', this.download);
	}

}

DownloadDirective.meta = {
	selector: '[[download]]',
	inputs: ['download']
};
