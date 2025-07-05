import Map from '../../utils/map.js'
import { HomepageModel } from './home-page-model'
import { HomePagePresenter } from './home-page-presenter'

export default class HomePage {
	#map = null

	async render() {
		return `
      <section>
        <div class="story-list__map_container">
          <div id="map" class="story-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="text-title">Daftar Story</h1>
        <div id="story-container" class="story-container"></div>
        
        <div id="spinner-loading"></div>
      </section>
    `
	}

	async afterRender() {
		this.initialMap()

		const model = new HomepageModel()
		const presenter = new HomePagePresenter(model, this)
		await presenter.getStories()
	}

	showData(data) {
		const stories = data.listStory
		const container = document.getElementById('story-container')

		stories.forEach((data) => {
			const story = document.createElement('story-item')
			story.data = data
			container.appendChild(story)

			if (data.lat && data.lon && this.#map?.addMarker) {
				const coordinate = [data.lat, data.lon]
				const markerOptions = { alt: data.description }
				const popupOptions = { content: data.description }

				this.#map.addMarker(coordinate, markerOptions, popupOptions)
			}
		})
	}

	errorFetch(message) {
		alert(message)
	}

	showLoading(isLoading) {
		const mainContent = document.getElementById('story-container')
		const loader = document.getElementById('spinner-loading')
		if (isLoading) {
			mainContent.classList.add('hidden')
			loader.classList.remove('hidden')
		} else {
			mainContent.classList.remove('hidden')
			loader.classList.add('hidden')
		}
	}

	async initialMap() {
		this.#map = await Map.build('#map', {
			zoom: 10,
			locate: true,
		})
	}
}
