import { map, tileLayer, Icon, icon, marker, popup, latLng } from 'leaflet'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import CONFIG from '../config'

export default class Map {
	#zoom = 10
	#map = null

	static isGeolocationAvailable() {
		return 'geolocation' in navigator
	}

	static getCurrentPosition(options = {}) {
		return new Promise((resolve, reject) => {
			if (!Map.isGeolocationAvailable()) {
				reject('Geolocation API unsupported')
				return
			}

			navigator.geolocation.getCurrentPosition(resolve, reject, options)
		})
	}

	createIcon(options = {}) {
		return icon({
			...Icon.Default.prototype.options,
			iconRetinaUrl: markerIcon2x,
			iconUrl: markerIcon,
			shadowUrl: markerShadow,
			...options,
		})
	}

	addMarker(coordinates, markerOptions = {}, popupOptions = null) {
		if (typeof markerOptions !== 'object') {
			throw new Error('markerOptions must be an object')
		}
		const newMarker = marker(coordinates, {
			icon: this.createIcon(),
			...markerOptions,
		})
		if (popupOptions) {
			if (typeof popupOptions !== 'object') {
				throw new Error('popupOptions must be an object')
			}
			if (!('content' in popupOptions)) {
				throw new Error('popupOptions must include `content` property.')
			}
			const newPopup = popup(coordinates, popupOptions)
			newMarker.bindPopup(newPopup)
		}
		newMarker.addTo(this.#map)
		return newMarker
	}

	static async build(selector, options = {}) {
		if ('center' in options && options.center) {
			return new Map(selector, options)
		}

		const jakartaCoordinate = [-6.2, 106.816666]

		if ('locate' in options && options.locate) {
			try {
				const position = await Map.getCurrentPosition()
				const coordinate = [position.coords.latitude, position.coords.longitude]

				return new Map(selector, {
					...options,
					center: coordinate,
				})
			} catch (error) {
				console.error('build: error:', error)

				return new Map(selector, {
					...options,
					center: jakartaCoordinate,
				})
			}
		}

		return new Map(selector, {
			...options,
			center: jakartaCoordinate,
		})
	}

	static async getPlaceNameByCoordinate(lat, lon) {
		const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${CONFIG.MAP_SERVICE_API_KEY}`

		try {
			const response = await fetch(url)
			const data = await response.json()

			if (data.features && data.features.length > 0) {
				let placeName = data.features[0].place_name

				const maxChar = 50

				if (placeName.length > maxChar) {
					placeName = placeName.slice(0, maxChar) + '...'
					return placeName
				}
				return placeName
			} else {
				return 'Lokasi tidak ditemukan'
			}
		} catch (error) {
			console.error('Reverse geocoding error:', error)
			return 'Terjadi kesalahan'
		}
	}

	changeCamera(coordinate, zoomLevel = null) {
		if (!zoomLevel) {
			this.#map.setView(latLng(coordinate), this.#zoom)
			return
		}
		this.#map.setView(latLng(coordinate), zoomLevel)
	}

	getCenter() {
		const { lat, lng } = this.#map.getCenter()
		return {
			latitude: lat,
			longitude: lng,
		}
	}

	addMapEventListener(eventName, callback) {
		this.#map.addEventListener(eventName, callback)
	}

	constructor(selector, options = {}) {
		this.#zoom = options.zoom ?? this.#zoom

		const baseLayers = {
			OpenStreetMap: tileLayer(
				'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				{
					attribution:
						'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
				}
			),
			Satellite: tileLayer(
				`https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${CONFIG.MAP_SERVICE_API_KEY}`,
				{
					attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>',
				}
			),
			Dark: tileLayer(
				`https://api.maptiler.com/maps/basic-dark/{z}/{x}/{y}.png?key=${CONFIG.MAP_SERVICE_API_KEY}`,
				{
					attribution: '&copy; <a href="https://www.maptiler.com">MapTiler</a>',
				}
			),
		}

		const tileOsm = tileLayer(
			'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
			{
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
			}
		)

		const defaultLayer = baseLayers.OpenStreetMap

		this.#map = map(document.querySelector(selector), {
			zoom: this.#zoom,
			scrollWheelZoom: false,
			layers: [defaultLayer],
			...options,
		})

		L.control.layers(baseLayers).addTo(this.#map)
	}
}
