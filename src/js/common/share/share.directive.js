import { Directive, getContext } from 'rxcomp';
import { fromEvent } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export class ShareDirective extends Directive {

	get href() {
		switch (this.share) {
			case 'facebook':
				return this.facebookUrl;
			case 'pinterest':
				return this.pinterestUrl;
			case 'linkedIn':
				return this.linkedInUrl;
			case 'twitter':
				return this.twitterUrl;
			case 'whatsapp':
				return this.whatsappUrl;
			case 'mailTo':
				return this.mailToUrl;
		}
	}

	get facebookUrl() {
		return `https://www.facebook.com/sharer/sharer.php?u=${this.url}`;
	}

	get pinterestUrl() {
		return `https://www.pinterest.com/pin/create/button/?url=${this.url}&media=&description=${this.title}`;
	}

	get linkedInUrl() {
		return `https://www.linkedin.com/shareArticle?mini=true&url=${this.url}&title=${this.title}`;
	}

	get twitterUrl() {
		return `https://twitter.com/intent/tweet?text=${this.title}%20${this.url}`;
	}

	get whatsappUrl() {
		return `https://api.whatsapp.com/send?text=${this.url}`;
	}

	get mailToUrl() {
		return `mailto:?subject=${this.title}&body=${this.url}`;
	}

	get title() {
		const title = this.shareTitle ? this.shareTitle : document.title;
		return this.encodeURI(title);
	}

	get url() {
		let url = this.shareUrl;
		if (url) {
			if (url.indexOf(window.location.origin) === -1) {
				url = window.location.origin + (url.indexOf('/') === 0 ? url : ('/' + url));
			}
		} else {
			url = window.location.href;
		}
		return this.encodeURI(url);
	}

	onInit() {
		// console.log('ShareComponent.onInit', this.share, this.title);
		const { node } = getContext(this);
		const href = this.href;
		node.setAttribute('href', href);
		if (this.share !== 'mailTo') {
			node.setAttribute('target', '_blank');
			fromEvent(node, 'click').pipe(
				tap(event => {
					event.preventDefault();
					window.open(href, 'ShareWindow', window.innerWidth >= 768 ? 'width=640,height=480' : '');
				}),
				takeUntil(this.unsubscribe$),
			).subscribe();
		}
	}

	/*
	onChanges() {
		console.log('ShareComponent.onChanges', this.share, this.shareTitle);
	}
	*/

	encodeURI(text) {
		return encodeURIComponent(text).replace(/[!'()*]/g, function(c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	}

}

ShareDirective.meta = {
	selector: '[share]',
	inputs: ['share', 'shareUrl', 'shareTitle'],
};
