// import { combineLatest } from 'rxjs';
// import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class MaterialsService {

	static all$() {
		if (environment.flags.production) {
			return ApiService.get$('/materials/all');
		} else {
			return ApiService.get$('/materials/all.json');
		}
	}

	static filters$() {
		if (environment.flags.production) {
			return ApiService.get$('/materials/filters');
		} else {
			return ApiService.get$('/materials/filters.json');
		}
	}

	/*
	static fake$() {
		return combineLatest([MaterialsService.all$(), ApiService.get$('/materials/icons.json')]).pipe(
			map(data => {
				let items = data[0];
				let icons = data[1];
				items.forEach(item => {
					if (item.items) {
						item.items.forEach(sub => {
							if (sub.icons) {
								const set = icons.sets[sub.icons];
								if (set) {
									sub.icons = set.map(x => icons.icons.find(icon => icon.id === x)).filter(x => x != null);
								}
								console.log(sub.icons);
							}
						});
					}
				});
				console.log(JSON.stringify(items));
				return items;
			})
		);
	}
	*/

	/*
	static fake$() {
		return combineLatest([MaterialsService.all$(), ApiService.get$('/materials/all_.json')]).pipe(
			map(data => {
				let items = data[0];
				let items_ = data[1];
				items = items.filter(x => x.category.name !== 'Tessuto' || !x.collection);
				items.forEach(item => {
					if (item.category.name === 'Tessuto') {
						item.items = items_.filter(x => x.collection && x.collection.id === item.id);
						console.log(item.items);
					}
				});
				console.log(JSON.stringify(items));
				return items;
				// !!!
				let collectionId = 1000;
				const fabrics = [];
				const collections = [];
				items_.forEach(item_ => {
					let collection = collections.find(x => x.name === item_.collection);
					if (!collection) {
						collection = {
							id: ++collectionId,
							name: item_.collection,
						};
						collections.push(collection);
						if (item_.category.name === 'Tessuto') {
							fabrics.push(Object.assign({
								image: `/aquafil/img/materials/tessuto/${collection.name.toLowerCase().replace(/\s/g, '_')}_512.jpg`,
								category: item_.category,
							}, collection));
						}
					}
				});
				console.log(fabrics);
				items.forEach((item, i) => {
					const item_ = items_.find(x => x.id === item.id);
					// if (item_) {
					//	item.image = item_.image.replace(/\s/g, '_').toLowerCase();
					//	item.zoom = item_.zoom.replace(/\s/g, '_').toLowerCase();
					// }
					const collection = collections.find(x => x.name === item.collection);
					console.log(collection);
					if (collection) {
						item.collection = collection;
					}
					// item.collection = MaterialsService.toTitleCase(item.collection);
					// item.title = MaterialsService.toTitleCase(item.title);
				});
				items = items.concat(fabrics);
				console.log(JSON.stringify(items));
				return items;
				// !!!
			})
		);
	}

	static toTitleCase(sentence, seps = ' _-/') {
		const capitalize = str => str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
		const escape = str => str.replace(/./g, c => `\\${c}`);
		let wordPattern = new RegExp(`[^${escape(seps)}]+`, 'g');
		return sentence.replace(wordPattern, capitalize);
	}
	*/

}
