import { Pipe } from 'rxcomp';
import { environment } from '../../environment';

export class SlugPipe extends Pipe {

	static transform(key) {
		const slug = environment.slug;
		return slug[key] || `#${key}`;
	}

}

SlugPipe.meta = {
	name: 'slug',
};
