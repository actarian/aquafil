import { BehaviorSubject, of, Subject } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

export class IntersectionService {

	static observer() {
		if (!this.observer_) {
			this.readySubject_ = new BehaviorSubject(false);
			this.observerSubject_ = new Subject();
			this.observer_ = new IntersectionObserver(entries => {
				// console.log('IntersectionService.observer', entries);
				this.observerSubject_.next(entries);
			}, {
				// root: document.querySelector('body'),
				root: null, // sets the framing element to the viewport
				rootMargin: '100px 0px 100px 0px',
				threshold: [0, 0.25, 0.5, 0.75, 1],
			});
		}
		return this.observer_;
	}

	static intersection$(node) {
		if ('IntersectionObserver' in window) {
			const observer = this.observer();
			observer.observe(node);
			return this.observerSubject_.pipe(
				// tap(entries => console.log(entries.length)),
				map(entries => entries.find(entry => entry.target === node)),
				// tap(entry => console.log('IntersectionService.intersection$', entry)),
				filter(entry => entry !== undefined),
				// filter(entry => entry !== undefined && entry.isIntersecting && entry.intersectionRatio > 0), // entry.intersectionRatio > 0
				// first(),
				finalize(() => observer.unobserve(node)),
			);
		} else {
			return of({ target: node });
		}

		/*
		function observer() {
			if ('IntersectionObserver' in window) {
				return new IntersectionObserver(entries => {
					entries.forEach(function(entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add('appear');
						}
					})
				});
			} else {
				return { observe: function(node) { node.classList.add('appear')}, unobserve: function() {} };
			}
		}
		observer.observe(node);
		observer.unobserve(node);
		*/

	}

}
