import { BehaviorSubject } from 'rxjs';

export class MenuService {

	static menu$_ = new BehaviorSubject(-1);

	static get currentMenu() {
		return this.menu$_.getValue();
	}

	static setMenu(id) {
		this.menu$_.next(id);
	}

	static toggleMenu(id) {
		this.menu$_.next(this.currentMenu === id ? -1 : id);
	}

	static onBack() {
		this.menu$_.next(-1);
	}

	static menu$() {
		return this.menu$_;
	}

}
