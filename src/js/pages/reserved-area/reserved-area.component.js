import { Component } from 'rxcomp';
import { of } from 'rxjs';
import { first, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LocomotiveScrollService } from '../../common/locomotive-scroll/locomotive-scroll.service';
import { ModalService } from '../../common/modal/modal.service';
import { environment } from '../../environment';
import { FilesService } from '../../shared/files/files.service';
import { UserService } from '../../shared/user/user.service';
import { ReservedAreaService } from './reserved-area.service';

export class ReservedAreaComponent extends Component {

	onInit() {
		this.user = undefined;
		this.items = [];
		this.tree = [];
		this.files = [];
		this.visibleFiles = [];
		this.item = null;
		this.downloadBusy = false;
		this.load$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe();
	}

	load$() {
		return UserService.me$().pipe(
			switchMap(user => {
				this.user = user;
				this.downloadBusy = true;
				this.pushChanges();
				// LocomotiveScrollService.update();
				return user ? ReservedAreaService.all$() : of([]);
			}),
			tap(items => {
				this.items = items;
				this.tree = this.getTree(items);
				this.visibleFiles = [];
				this.item = null;
				this.downloadBusy = false;
				this.pushChanges();
				// LocomotiveScrollService.update();
			}),
		);
	}

	getTree(items, parentId) {
		let tree = items.filter(x => x.parentId === parentId && x.type === 'folder').map(x => {
			const item = Object.assign({}, x);
			item.items = this.getTree(items, x.id);
			return item;
		});
		return tree;
	}

	onOpen(item) {
		if (item.active) {
			this.item = item;
			this.files = this.items.filter(x => x.type === 'file' && x.parentId === item.id);
			this.visibleFiles = this.files.slice(0, Math.min(8, this.files.length));
			this.pushChanges();
			LocomotiveScrollService.update();
		}
	}

	showMore(event) {
		const pageSize = 32;
		if (this.visibleFiles.length + pageSize >= this.files.length) {
			this.visibleFiles = this.files.slice();
		} else {
			this.visibleFiles = this.files.slice(0, Math.min(this.visibleFiles.length + pageSize, this.files.length));
		}
		this.pushChanges();
		LocomotiveScrollService.update();
	}

	onProjectRegistration(event) {
		ModalService.open$({ src: environment.template.modal.projectsRegistrationModal }).pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(event => {
			console.log('ReservedAreaComponent.onProjectRegistration', event);
		});
	}

	onToggleFile(file) {
		(this.isAddedToFiles(file) ? FilesService.removeFile$(file) : FilesService.addFile$(file)).pipe(
			first(),
		).subscribe(_ => {
			this.pushChanges();
		});
	}

	isAddedToFiles(file) {
		return FilesService.hasFile(file);
	}

	onLogout() {
		UserService.signout$().pipe(
			first(),
		).subscribe();
	}
}

ReservedAreaComponent.meta = {
	selector: '[reserved-area]',
};
