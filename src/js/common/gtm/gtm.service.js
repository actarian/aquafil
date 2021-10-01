function push_(event) {
	const dataLayer = window.dataLayer || [];
	dataLayer.push(event);
	console.log('GtmService.dataLayer', event);
}

export class GtmService {

	static push(event) {
		return push_(event);
	}

}
