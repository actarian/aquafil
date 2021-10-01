import { map } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { environment } from '../../environment';

export class ProductsDetailService {

	static versions$(productId) {
		if (environment.flags.production) {
			return ProductsDetailService.sort$(ApiService.get$('/products/versions?productId=' + productId));
		} else {
			return ProductsDetailService.sort$(ApiService.get$('/products-detail/versions.json'));
		}
	}

	static sort$(items$) {
		return items$.pipe(
			map(items => {
				items.sort((a, b) => {
					if (a.configurable !== b.configurable) {
						return a.configurable ? -1 : 1;
					} else {
						return 0;
					}
				});
				/*
				if (environment.flags.cart) {
					items.sort((a, b) => {
						if (a.configurable !== b.configurable) {
							return a.configurable ? -1 : 1;
						} else {
							return 0;
						}
					});
				} else {
					items.forEach(x => x.configurable = false);
				}
				*/
				return items;
			}),
		);
	}

}
