import { parseActivePathname } from '../../routes/url-parser.js'
import { showFormattedDate } from '../../utils/index.js'
import { DetailPageModel } from './detail-model.js'
import { DetailPagePresenter } from './detail-presenter.js'
import Map from '../../utils/map.js'

export default class DetailPage {
	#map = null
	#presenter = null

	async render() {
		return `
      <section>
        <div class="report-detail__container">
          <div id="report-detail" class="report-detail"></div>
          <div id="report-detail-loading-container"></div>
        </div>
      </section>
    `
	}

	async afterRender() {
		const model = new DetailPageModel()
		this.#presenter = new DetailPagePresenter(model, this)
		const id = parseActivePathname().id

		await this.#presenter.fetchStoryById(id)
	}

	async initialMap() {
		this.#map = await Map.build('#map', {
			zoom: 15,
		})
	}

	async showData(data) {
		const { photoUrl, name, description, createdAt, lat, lon, placeName } = data

		document.getElementById('report-detail').innerHTML =
			this.generateDetailStory({
				name: name,
				description: description,
				photoUrl: photoUrl,
				latitudeLocation: lat,
				longitudeLocation: lon,
				placeName: placeName,
				createdAt: createdAt,
			})

		await this.#presenter.showReportDetailMap()
		if (this.#map) {
			const reportCoordinate = [lat, lon]
			const markerOptions = { alt: description }
			const popupOptions = { content: description }
			this.#map.changeCamera(reportCoordinate)
			this.#map.addMarker(reportCoordinate, markerOptions, popupOptions)
		}
	}

	errorFetch(message) {
		alert(message)
	}

	generateDetailStory({
		name,
		description,
		photoUrl,
		latitudeLocation,
		longitudeLocation,
		placeName,
		createdAt,
	}) {
		const createdAtFormatted = showFormattedDate(createdAt, 'id-ID')

		return `
      <div class="report-detail__header">
      <h1 id="title" class="report-detail__title">${name}</h1>

      <div class="report-detail__more-info">
        <div class="report-detail__more-info__inline">
          <div id="createdat" class="report-detail__createdat" data-value="${createdAtFormatted}">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div id="location" class="report-item__location" data-value="${placeName}">
            <i class="fas fa-map"></i>
          </div>
        </div>
        

        <div class="report-detail__more-info__inline">
          <div id="location-latitude" class="report-detail__location__latitude" data-value="${latitudeLocation}">Latitude:</div>
          <div id="location-longitude" class="report-detail__location__longitude" data-value="${longitudeLocation}">Longitude:</div>
        </div>
        <div id="author" class="report-detail__author" data-value="${name}">Dibuat oleh:</div>
      </div>
    </div>

    <div class="container container-image">
      <image src="${photoUrl}" class="report-detail__images">
    </div>

    <div class="container">
      <div class="report-detail__body">
        <div class="report-detail__body__description__container">
          <h2 class="report-detail__description__title">Deskripsi Lengkap</h2>
          <div id="description" class="report-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="report-detail__body__map__container">
          <h2 class="report-detail__map__title">Peta Lokasi</h2>
          <div class="report-detail__map__container">
            <div id="map" class="report-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
        </div>
      </div>
    </div>
    `
	}
}
