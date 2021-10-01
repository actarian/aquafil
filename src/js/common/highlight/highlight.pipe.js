
import { Pipe } from 'rxcomp';

export class HighlightPipe extends Pipe {

	static transform(text, query) {
		if (!query) {
			return text;
		}
		if (!Array.isArray(query)) {
			query = [query];
		}
		// text = HighlightPipe.encodeHTML(text);
		const escapedQuery = query.map(x => HighlightPipe.escapeRegexChars(x));
		const regExp = new RegExp(`(\<[^\>]+\>)|(${escapedQuery.join('|')})`, 'gmi');
		// const regExp = new RegExp(`(?<!\<)${escapedQuery.join('(?![\w\s]*[\>])|(?<!\<)')}(?![\w\s]*[\>])`, 'gmi');
		// const regExp = new RegExp('&[^;]+;|' + escapedQuery.join('|'), 'gi');
		text = text.replace(regExp, function(match, g1, g2) {
			if (g1) {
				return g1;
			} else {
				return '<b>' + g2 + '</b>';
			}
			// return match.toLowerCase() === x.toLowerCase() ? '<strong>' + match + '</strong>' : match;
		});
		// text = HighlightPipe.decodeHTML(text);
		console.log(text, query);
		return text;
	}

	static escapeRegexChars(text) {
		return text.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	}

	static safeToString(text) {
		return text === undefined || text === null ? '' : text.toString().trim();
	}

	static encodeHTML(text) {
		return this.safeToString(text)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	static decodeHTML(text) {
		return text
			.replace(/&amp;/g, '&')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
	}

}

HighlightPipe.meta = {
	name: 'highlight',
};

