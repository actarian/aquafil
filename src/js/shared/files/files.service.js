import { BehaviorSubject, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LocalStorageService } from '../../common/storage/local-storage.service';

export class FilesService {

	static files$_ = new BehaviorSubject([]);

	static get currentFiles() {
		return this.files$_.getValue();
	}

	static hasFile(file) {
		const files = this.currentFiles;
		const index = files.reduce((p, c, i) => {
			return p !== -1 ? p : (c.id === file.id ? i : p);
		}, -1);
		return index !== -1;
	}

	static setFiles(files) {
		if (files) {
			LocalStorageService.set('files', files);
		} else {
			LocalStorageService.delete('files');
		}
		this.files$_.next(files);
	}

	static files$() {
		const localFiles = LocalStorageService.get('files') || [];
		return of(localFiles).pipe(
			switchMap(files => {
				this.setFiles(files);
				return this.files$_;
			})
		);
	}

	static addFile$(file) {
		return of(file).pipe(
			map(file => {
				const files = this.currentFiles.slice();
				const index = files.reduce((p, c, i) => {
					return p !== -1 ? p : (c.id === file.id ? i : p);
				}, -1);
				if (index === -1) {
					files.push(file);
					this.setFiles(files);
					return file;
				} else {
					return null;
				}
			}),
		)
	}

	static removeFile$(file) {
		return of(file).pipe(
			map(file => {
				const files = this.currentFiles.slice();
				const index = files.reduce((p, c, i) => {
					return p !== -1 ? p : (c.id === file.id ? i : p);
				}, -1);
				if (index !== -1) {
					files.splice(index, 1);
					this.setFiles(files);
					return file;
				} else {
					return null;
				}
			}),
		)
	}

	static removeAll$() {
		return of([]).pipe(
			map(files => {
				this.setFiles(files);
				return files;
			}),
		)
	}

}
