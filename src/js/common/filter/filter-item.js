import { BehaviorSubject } from 'rxjs';

export const FilterMode = {
	SELECT: 'select',
	AND: 'and',
	OR: 'or',
	QUERY: 'query',
};

export class FilterItem {

	constructor(filter) {
		this.change$ = new BehaviorSubject();
		this.mode = FilterMode.SELECT;
		this.filter = 'Filter';
		this.placeholder = null;
		this.values = [];
		this.options = [];
		if (filter) {
			Object.assign(this, filter);
		}
		if (filter.mode === FilterMode.SELECT) {
			filter.options.unshift({
				label: 'select',
				value: undefined,
			});
		}
	}

	filter(item, value) {
		return item.options.indexOf(value) !== -1;
	}

	match(item) {
		let match;
		if (this.mode === FilterMode.OR) {
			match = this.values.length ? false : true;
			this.values.forEach(value => {
				match = match || this.filter(item, value);
			});
		} else {
			match = true;
			this.values.forEach(value => {
				match = match && this.filter(item, value);
			});
		}
		return match;
	}

	getLabel() {
		if (this.hasAny()) {
			return this.options.filter(x => x.value && this.values.indexOf(x.value) !== -1).map(x => x.label).join(', ');
		} else {
			return null;
		}
		/*
		if (this.mode === FilterMode.QUERY) {
			return this.label;
			// return this.placeholder || this.label;
		} else if (this.mode === FilterMode.SELECT) {
			if (this.hasAny()) {
				return this.options.filter(x => x.value && this.values.indexOf(x.value) !== -1).map(x => x.label).join(', ');
			} else {
				return this.label;
			}
		} else {
			return this.label;
		}
		*/
	}

	hasAny() {
		return this.values.length > 0;
	}

	has(item) {
		return this.values.indexOf(item.value) !== -1;
	}

	set(item) {
		if (this.mode === FilterMode.QUERY) {
			this.values = item ? [item] : [];
			// this.placeholder = item;
		} else {
			if (this.mode === FilterMode.SELECT) {
				this.values = [];
			}
			const index = this.values.indexOf(item.value);
			if (index === -1) {
				if (item.value != null) {
					this.values.push(item.value);
				}
			}
			/*
			if (this.mode === FilterMode.SELECT) {
				this.placeholder = item.label;
			}
			*/
		}
		// console.log('FilterItem.set', item);
		this.change$.next();
	}

	remove(item) {
		const index = this.values.indexOf(item.value);
		if (index !== -1) {
			this.values.splice(index, 1);
		}
		/*
		if (this.mode === FilterMode.SELECT) {
			const first = this.options[0];
			this.placeholder = first.label;
		}
		*/
		// console.log('FilterItem.remove', item);
		this.change$.next();
	}

	toggle(item) {
		if (this.has(item)) {
			this.remove(item);
		} else {
			this.set(item);
		}
	}

	clear() {
		this.values = [];
		/*
		if (this.mode === FilterMode.SELECT) {
			const first = this.options[0];
			this.placeholder = first.label;
		}
		*/
		this.change$.next();
	}
}
