export default class CreateStoryPresenter {
	#view
	#model

	constructor({ view, model }) {
		this.#view = view
		this.#model = model
	}

	async showNewFormMap() {
		try {
			await this.#view.initialMap()
		} catch (error) {
			console.error('showNewFormMap: error:', error)
		}
	}

	async postNewStory({ description, photo, lat, lon }) {
		this.#view.showSubmitLoadingButton(true)
		try {
			const data = {
				description: description,
				photo: photo,
				lat: lat,
				lon: lon,
			}
			const response = await this.#model.postNewStory(data)

			this.#view.storeSuccessfully(response.message, response.data)
		} catch (error) {
			console.error('postNewReport: error:', error)
			this.#view.storeFailed(error.message)
		} finally {
			this.#view.showSubmitLoadingButton(false)
		}
	}
}
