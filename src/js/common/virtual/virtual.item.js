import { Context } from 'rxcomp';

export class VirtualItem extends Context {
	constructor(key, $key, value, $value, index, count, parentInstance) {
		super(parentInstance);
		this[key] = $key;
		this[value] = $value;
		this.index = index;
		this.count = count;
	}

	get first() {
		return this.index === 0;
	}

	get last() {
		return this.index === this.count - 1;
	}

	get even() {
		return this.index % 2 === 0;
	}

	get odd() {
		return !this.even;
	}
}
