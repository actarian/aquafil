import { BehaviorSubject } from 'rxjs';

export class HeaderService {

	static header$_ = new BehaviorSubject(-1);

	static get currentHeader() {
		return this.header$_.getValue();
	}

	static setHeader(id) {
		this.header$_.next(id);
	}

	static toggleHeader(id) {
		this.header$_.next(this.currentHeader === id ? -1 : id);
	}

	static onBack() {
		this.header$_.next(-1);
	}

	static header$() {
		return this.header$_;
	}

}
