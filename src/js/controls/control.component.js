import { Component, getContext } from 'rxcomp';

let UID = 10000;

export class ControlComponent extends Component {

	get uniqueId() {
		return this.control.name + this.uid;
	}

	onInit() {
		this.uid = ++UID;
		this.label = this.label || 'label';
	}

	onChanges() {
		const { node } = getContext(this);
		// console.log(this, node, this.control);
		const control = this.control;
		const flags = control.flags;
		Object.keys(flags).forEach((key) => {
			flags[key] ? node.classList.add(key) : node.classList.remove(key);
		});
	}

}

ControlComponent.meta = {
	selector: '[control]',
	inputs: ['control']
};
