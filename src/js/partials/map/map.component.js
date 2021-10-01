import MarkerClusterer from '@googlemaps/markerclustererplus';
import { Component, getContext } from 'rxcomp';
import { first } from 'rxjs/operators';
import { GoogleMapsService } from '../../common/googlemaps/googlemaps.service';
import { environment } from '../../environment';
import { MAP_STYLE } from './map.style';

const USE_CLUSTERER = true;

export class MapComponent extends Component {

	onInit() {
		GoogleMapsService.maps$().pipe(
			first(),
		).subscribe(maps => {

			const google = window.google;
			const { node } = getContext(this);
			const center = this.center;
			const item = this.items && this.items.length ? this.items[0] : null;
			const position = item ? new google.maps.LatLng(item.latitude, item.longitude) : null;

			const mapOptions = {
				zoom: 15, // 9,
				center: position,
				scrollwheel: false,
				// mapTypeId: google.maps.MapTypeId.ROADMAP,
				zoomControlOptions: {
					style: google.maps.ZoomControlStyle.DEFAULT
				},
				// overviewMapControl: true,
				scaleControl: false,
				zoomControl: true,
				mapTypeControl: false,
				streetViewControl: false,
				rotateControl: true,
				fullscreenControl: true,
				styles: MAP_STYLE
			};

			const mapElement = node.querySelector('.map');
			const map = this.map = new google.maps.Map(mapElement, mapOptions);
			this.addMarkers(this.items);
			if (!this.items) {
				map.fitBounds(this.getItalyBounds());
			}

		});
	}

	onChanges() {
		this.clearMarkers();
		this.addMarkers(this.items);
	}

	calculateDistance(lat1, lon1, lat2, lon2, unit) {
		if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		} else {
			const radlat1 = Math.PI * lat1 / 180;
			const radlat2 = Math.PI * lat2 / 180;
			const theta = lon1 - lon2;
			const radtheta = Math.PI * theta / 180;
			let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180 / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit == "K") {
				dist = dist * 1.609344;
			}
			if (unit == "N") {
				dist = dist * 0.8684;
			}
			return dist;
		}
	}

	clearMarkers() {
		if (this.markerCluster) {
			this.markerCluster.clearMarkers();
		}
		if (this.markers) {
			this.markers.forEach(marker => marker.setMap(null));
		}
	}

	addMarkers(items) {
		const map = this.map;
		if (map && items) {
			const bounds = new google.maps.LatLngBounds();

			const markers = items.map((item) => {

				const position = new google.maps.LatLng(item.latitude, item.longitude);

				bounds.extend(position);

				let content = /* html */`<div class="card--store-locator">
					<div class="card__content">
						<div class="card__name"><span>${item.name}</span></div>
						<div class="card__address">${item.address}</div>
						<div class="card__city">${item.city}</div>
						<div class="card__country">${item.country.name}</div>
						${item.phone ? `<a class="card__phone" href="tel:${item.phone}">${item.phone}</a>` : ''}
						${item.fax ? `<a class="card__fax" href="tel:${item.fax}">${item.fax}</a>` : ''}
						${item.email ? `<a class="card__email" href="mailto:${item.email}">${item.email}</a>` : ''}
					</div>
				</div>`;

				/*
				`<div class="marker__content">
					<div class="title"><span>${item.name}</span></div>
					<div class="group group--info">
						<div class="address">
							${item.address}<br>
							${item.city} ${item.country}<br>
							${item.phone ? `<span><a href="tel:${item.phone}">${item.phone}</a><br></span>` : ''}
							${item.fax ? `<span><a href="tel:${item.fax}">${item.fax}</a><br></span>` : ''}
							${item.email ? `<span><a href="mailto:${item.email}">${item.email}</a><br></span>` : ''}
						</div>
						${item.address !== '' ? `<div class="distance">${this.labels.approximately} <b>${Math.floor(item.distance)} km</b></div>` : ``}
					</div>
					<div class="group group--cta">
						${item.address !== '' ? `<a id="locator-marker" href="https://www.google.it/maps/dir/${position.lat()},${position.lng()}/${item.title}/@${item.latitude},${item.longitude}/" target="_blank" class="btn btn--link"><span>${this.labels.reachStore}</span></a>` : ``}
						${item.type === 8 || item.type === 9 ? `<a id="contact-item" href="${window.itemLocatorSettings.urlStoreContact}?item=${item.id}" target="_blank" class="btn btn--link"><span>${this.labels.contactStore}</span></a>` : ''}
					</div>
				</div>`
				*/

				const markerImage = new google.maps.MarkerImage(
					`${environment.assets}img/maps/marker-sm.png`,
					new google.maps.Size(24, 32),
				);

				let marker = new google.maps.Marker({
					position: position,
					map: USE_CLUSTERER ? null : map,
					icon: markerImage,
					title: item.title,
					item: item,
					content: content,
				});
				marker.addListener('click', () => {
					this.setMarkerWindow(marker.position, content);
					// this.scrollToStore(item);
					// GtmService.push({ event: 'dealerlocator', action: 'marker-click', label: item.title });
				});
				item.marker = marker;
				return marker;
			});

			if (USE_CLUSTERER) {
				const markerCluster = new MarkerClusterer(this.map, markers, {
					imagePath: `${environment.assets}img/maps/cluster-`,
				});
				const styles = markerCluster.getStyles();
				const sizes = [48, 56, 64, 72, 80];
				styles.forEach((style, i) => {
					style.width = sizes[i];
					style.height = sizes[i];
					style.textLineHeight = sizes[i];
					style.textSize = Math.floor(style.width / 5);
					style.textColor = '#ffffff';
				});
				markerCluster.setStyles(styles);
				this.markerCluster = markerCluster;
			}

			this.markers = markers;

			map.fitBounds(bounds);
		}
	}

	getGeolocation(map) {
		this.error = null;
		this.busyLocation = true;
		let position = this.map.getCenter();

		// Try HTML5 geolocation.
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((location) => {
				position = new google.maps.LatLng(location.coords.latitude, location.coords.longitude);
				const geocoder = this.geocoder || new google.maps.Geocoder();
				this.geocoder = geocoder;
				geocoder.geocode({ 'location': position }, (results, status) => {
					if (status == 'OK') {
						const filteredInfoCity = results.filter(function(address_component) {
							return address_component.types.includes("locality");
						});
						this.model.city = filteredInfoCity.length ? filteredInfoCity[0].formatted_address : undefined;
						this.model.address = results[0].formatted_address;

						for (let i = 0; i < results[0].address_components.length; i++) {
							if (results[0].address_components[i].types[0] == "country" || results[0].address_components[i].types[0] == "political") {
								this.searchCountry = results[0].address_components[i].short_name;
							}
						}

						this.setInfoWindow(position, 1);
						this.searchPosition(position).finally(() => this.busyLocation = false);
						this.map.setCenter(position);
						this.map.setZoom(ZOOM_LEVEL);
					}
				});
			}, () => {
				this.setInfoWindow(position, 2);
				this.searchPosition(position).finally(() => this.busyLocation = false);
			});
		} else {
			// Browser doesn't support Geolocation
			this.setInfoWindow(position, 3);
			this.searchPosition(position).finally(() => this.busyLocation = false);
		}
	}

	fitBounds(items) {
		if (items.length) {
			const bounds = new google.maps.LatLngBounds();
			items.forEach((item) => {
				const position = new google.maps.LatLng(item.latitude, item.longitude);
				bounds.extend(position);
			});
			this.map.fitBounds(bounds);
			// console.log('fitBounds');
		}
	}

	findNearStores(items, position) {
		if (items) {
			items.forEach((item) => {
				item.distance = this.calculateDistance(item.latitude, item.longitude, position.lat(), position.lng(), 'K');
				item.visible = (item.cod_stato == window.userCountry || !window.userCountry) && item.distance <= MAX_DISTANCE /* Km */;
				if (item.visible) {
					if (item.removed) {
						this.markerCluster.addMarker(item.marker);
					}
					delete item.removed;
				} else {
					this.markerCluster.removeMarker(item.marker);
					item.removed = true;
				}
			});
			items = items.slice();
			items.sort((a, b) => {
				return a.distance * (a.importante ? 0.5 : 1) - b.distance * (b.importante ? 0.5 : 1);
			});
			const visibleStores = items.filter(item => item.visible).slice(0, 50);
			this.$timeout(() => {
				this.visibleStores = visibleStores;
			}, 1);
			// console.log('findNearStores', visibleStores);
			return visibleStores;
		}
	}

	panTo(item) {
		const position = new google.maps.LatLng(item.latitude, item.longitude);
		this.map.setZoom(ZOOM_LEVEL);
		this.map.panTo(position);
		const marker = this.markers.find(x => x.item === item);
		this.setMarkerWindow(marker.position, marker.content);
	}

	setMarkerWindow(position, content) {
		if (position) {
			const markerWindow = this.markerWindow || new google.maps.InfoWindow({
				pixelOffset: new google.maps.Size(0, -35)
			});
			this.markerWindow = markerWindow;
			markerWindow.setPosition(position);
			markerWindow.setContent(content);
			markerWindow.open(this.map);
		} else {
			this.closeMarkerWindow();
		}
	}

	closeMarkerWindow() {
		if (this.markerWindow) {
			this.markerWindow.close();
		}
	}

	getWorldBounds() {
		return new google.maps.LatLngBounds(
			new google.maps.LatLng(61, 60),
			new google.maps.LatLng(-37, -92)
		);
	}

	getItalyBounds() {
		return new google.maps.LatLngBounds(
			new google.maps.LatLng(46.4657567, 5.233972),
			new google.maps.LatLng(36.8257773, 18.963541)
		);
	}
}

MapComponent.meta = {
	selector: '[map]',
	inputs: ['center', 'items'],
};
