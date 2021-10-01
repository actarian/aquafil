import { Component, getContext } from 'rxcomp';
import { first, takeUntil } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { FilesService } from './files.service';

export class FilesComponent extends Component {

	onInit() {
		this.showFiles = false;
		this.user = null;
		UserService.me$().pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(user => {
			this.user = user;
			this.pushChanges();
		});
		this.files = [];
		FilesService.files$().pipe(
			takeUntil(this.unsubscribe$)
		).subscribe(files => {
			this.files = files;
			this.pushChanges();
		});
	}

	onToggleFiles(event) {
		this.showFiles = !this.showFiles;
		this.pushChanges();
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

	onDownloadAll(event) {
		event.preventDefault();
		const { node } = getContext(this);
		FilesService.currentFiles.forEach(file => {
			const link = document.createElement('a');
			link.setAttribute('href', file.url);
			link.setAttribute('download', file.title);
			link.setAttribute('target', '_blank');
			link.click();
			/*
			const item = node.querySelector(`[href]="${file.url}"`);
			if (item) {
				item.click();
			}
			*/
			// window.open(file.url, '_blank');
		});
	}

	onRemoveAll(event) {
		FilesService.removeAll$().pipe(
			first(),
		).subscribe();
	}

}

FilesComponent.meta = {
	selector: '[files]',
};
