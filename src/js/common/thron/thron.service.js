import { fromEvent, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

// <!-- <script id=ta_bootstrapper src='https://gruppoconcorde-cdn.thron.com/shared/plugins/tracking/current/bootstrapper-min.js'></script> -->
// <script src='https://gruppoconcorde-cdn.thron.com/shared/ce/bootstrap/1/scripts/embeds-min.js'></script>

export class ThronService {

	static thron$() {
		let thron = window.THRONContentExperience || window.THRONPlayer;
		if (thron) {
			return of(thron);
		} else {
			const script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('src', 'https://gruppoconcorde-cdn.thron.com/shared/ce/bootstrap/1/scripts/embeds-min.js')
			const loaded$ = fromEvent(script, 'load').pipe(
				// tap(event => console.log(event, window.THRONContentExperience || window.THRONPlayer)),
				map(event => window.THRONContentExperience || window.THRONPlayer),
				shareReplay(1),
			);
			return document.head.appendChild(script) && loaded$;
		}
	}

}
