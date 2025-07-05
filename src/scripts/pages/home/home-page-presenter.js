export class HomePagePresenter {
	constructor(model, view) {
		this.model = model
		this.view = view
	}

	async getStories(page, size, location) {
		try {
			this.view.showLoading(true)
			const data = await this.model.fetchStories(page, size, location)
			this.view.showData(data)
		} catch (error) {
			this.view.errorFetch(error)
		} finally {
			this.view.showLoading(false)
		}
	}
}
