import { convertBase64ToBlob, navigateTo } from '../../utils'
import * as CityCareAPI from '../../data/api'
import CreateStoryPresenter from './create-story-presenter'
import Camera from '../../utils/camera'
import Map from '../../utils/map'
import { CreateStoryModel } from './create-story-model'

export default class CreateStoryPage {
	#presenter
	#form
	#camera
	#isCameraOpen = false
	#takenDocumentations = []
	#map = null

	async render() {
		return `
      <section>
        <div class="new-story__header">
          <div class="container">
            <h1 class="new-story__header__title">Buat Cerita Baru</h1>
            <p class="new-story__header__description">
              Yuk, bagikan cerita baru kamu melalui formulir di bawah ini
            </p>
          </div>
        </div>
      </section>
  
      <section class="container form_container">
        <div class="new-form__container">
          <form id="new-form" class="new-form">
            <div class="form-control">
              <label for="title-input" class="new-form__title__title">Deskripsi Cerita</label>
  
              <div class="new-form__title__container">
                <textarea
                  id="description-input"
                  name="description"
                  placeholder="Masukan deskripsi cerita Anda"
                ></textarea>
              </div>
            </div>
            <div class="form-control">
              <div id="documentation-info">Sertakan gambar dari Cerita Anda</div>
  
              <div class="new-form__documentations__container">
                <div class="new-form__documentations__buttons">
                  <button id="documentations-input-button" class="btn btn-outline" type="button">
                    Ambil Gambar
                  </button>
                  <input
                    id="documentations-input"
                    name="documentations"
                    type="file"
                    accept="image/*"
                    hidden="hidden"
                    aria-multiline="true"
                    aria-describedby="documentations-more-info"
                  >
                  <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                    Buka Kamera
                  </button>
                </div>
                <div id="camera-container" class="new-form__camera__container">
                  <video id="camera-video" class="new-form__camera__video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="new-form__camera__canvas"></canvas>
  
                  <div class="new-form__camera__tools">
                    <select id="camera-select"></select>
                    <div class="new-form__camera__tools_buttons">
                      <button id="camera-take-button" class="btn" type="button">
                        Ambil Gambar
                      </button>
                    </div>
                  </div>
                </div>
                <ul id="documentations-taken-list" class="new-form__documentations__outputs"></ul>
              </div>
            </div>
            <div class="form-control">
              <div class="new-form__location__title">Lokasi</div>
  
              <div class="new-form__location__container">
                <div class="new-form__location__map__container">
                  <div id="map" class="new-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="new-form__location__lat-lng">
                  <input type="number" name="latitude" value="-6.175389" disabled>
                  <input type="number" name="longitude" value="106.827139" disabled>
                </div>
              </div>
            </div>
            <div class="form-buttons">
              <div class="submit-button-container">
                <button id="loadingBtn" class="btn">
                  <span class="spinner hidden"></span>
                  <span class="btn-text">Buat Cerita</span>
                </button>
                <button class="btn btn-outline" href="#/">Batal</a>
              </div>
            </div>
          </form>
        </div>
      </section>
    `
	}

	async afterRender() {
		this.#presenter = new CreateStoryPresenter({
			view: this,
			model: new CreateStoryModel(),
		})
		this.#takenDocumentations = []

		this.#presenter.showNewFormMap()
		this.#setupForm()
	}

	#setupForm() {
		this.#form = document.getElementById('new-form')
		this.#form.addEventListener('submit', async (event) => {
			event.preventDefault()

			if (!this.#takenDocumentations.length) {
				alert('photo tidak boleh kosong')
				return
			}
			const data = {
				description: this.#form.elements.namedItem('description').value,
				photo: this.#takenDocumentations[0].blob,
				lat: this.#form.elements.namedItem('latitude').value,
				lon: this.#form.elements.namedItem('longitude').value,
			}

			await this.#presenter.postNewStory(data)
		})

		document
			.getElementById('documentations-input')
			.addEventListener('change', async (event) => {
				const file = event.target.files[0]
				if (file) {
					await this.#addTakenPicture(file)
					await this.#populateTakenPictures()
				}
			})

		document
			.getElementById('documentations-input-button')
			.addEventListener('click', () => {
				this.#form.elements.namedItem('documentations-input').click()
			})

		const cameraContainer = document.getElementById('camera-container')
		document
			.getElementById('open-documentations-camera-button')
			.addEventListener('click', async (event) => {
				cameraContainer.classList.toggle('open')
				this.#isCameraOpen = cameraContainer.classList.contains('open')

				if (this.#isCameraOpen) {
					event.currentTarget.textContent = 'Tutup Kamera'
					this.#setupCamera()
					await this.#camera.launch()

					return
				}

				event.currentTarget.textContent = 'Buka Kamera'
				this.#camera.stop()
			})
	}

	async initialMap() {
		this.#map = await Map.build('#map', {
			zoom: 15,
			locate: true,
		})

		const centerCoordinate = this.#map.getCenter()
		const draggableMarker = this.#map.addMarker(
			[centerCoordinate.latitude, centerCoordinate.longitude],
			{ draggable: 'true' }
		)

		this.#updateLatLngInput(
			centerCoordinate.latitude,
			centerCoordinate.longitude
		)

		draggableMarker.addEventListener('move', (event) => {
			const coordinate = event.target.getLatLng()
			this.#updateLatLngInput(coordinate.lat, coordinate.lng)
		})

		this.#map.addMapEventListener('click', (event) => {
			draggableMarker.setLatLng(event.latlng)
			event.sourceTarget.flyTo(event.latlng)
		})
	}

	#updateLatLngInput(latitude, longitude) {
		this.#form.elements.namedItem('latitude').value = latitude
		this.#form.elements.namedItem('longitude').value = longitude
	}

	#setupCamera() {
		if (!this.#camera) {
			this.#camera = new Camera({
				video: document.getElementById('camera-video'),
				cameraSelect: document.getElementById('camera-select'),
				canvas: document.getElementById('camera-canvas'),
			})
		}

		this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
			const image = await this.#camera.takePicture()
			await this.#addTakenPicture(image)
			await this.#populateTakenPictures()
		})
	}

	async #addTakenPicture(image) {
		let blob = image

		if (image instanceof String) {
			blob = await convertBase64ToBlob(image, 'image/png')
		}

		const newDocumentation = {
			id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
			blob: blob,
		}
		this.#takenDocumentations = [newDocumentation]
	}

	async #populateTakenPictures() {
		const html = this.#takenDocumentations.reduce(
			(accumulator, picture, currentIndex) => {
				const imageUrl = URL.createObjectURL(picture.blob)
				return accumulator.concat(`
        <li class="new-form__documentations__outputs-item">
          <button type="button" data-deletepictureid="${
						picture.id
					}" class="new-form__documentations__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="gambar ke-${currentIndex + 1}">
          </button>
        </li>
      `)
			},
			''
		)

		document.getElementById('documentations-taken-list').innerHTML = html

		document
			.querySelectorAll('button[data-deletepictureid]')
			.forEach((button) =>
				button.addEventListener('click', (event) => {
					const pictureId = event.currentTarget.dataset.deletepictureid

					const deleted = this.#removePicture(pictureId)
					if (!deleted) {
						console.log(`Picture with id ${pictureId} was not found`)
					}

					this.#populateTakenPictures()
				})
			)
	}

	#removePicture(id) {
		const selectedPicture = this.#takenDocumentations.find((picture) => {
			return picture.id == id
		})

		if (!selectedPicture) {
			return null
		}

		this.#takenDocumentations = this.#takenDocumentations.filter((picture) => {
			return picture.id != selectedPicture.id
		})

		return selectedPicture
	}

	storeSuccessfully(message) {
		this.#camera.stop()
		alert(message)
		this.clearForm()
		navigateTo('/')
	}

	storeFailed(message) {
		alert(message)
	}

	clearForm() {
		this.#form.reset()
	}

	showSubmitLoadingButton(isLoading) {
		const button = document.getElementById('loadingBtn')
		const btnText = button.querySelector('.btn-text')
		const spinner = button.querySelector('.spinner')

		if (isLoading) {
			button.disabled = true
			btnText.textContent = 'Loading...'
			spinner.classList.remove('hidden')
			return
		}

		btnText.textContent = 'Buat Cerita'
		spinner.classList.add('hidden')
		button.disabled = false
	}
}
