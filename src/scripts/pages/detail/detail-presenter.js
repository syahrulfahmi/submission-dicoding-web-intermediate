import { storyMapper } from '../../data/map-mapper'

export class DetailPagePresenter {
	constructor(model, view) {
		this.model = model
		this.view = view
	}

	async fetchStoryById(id) {
		try {
			const data = await this.model.fetchStoryById(id)
			const report = await storyMapper(data.story)
			this.view.showData(report)
		} catch (error) {
			console.log(error)
			this.view.errorFetch(error)
		}
	}

	async showReportDetailMap() {
		try {
			await this.view.initialMap()
		} catch (error) {
			console.error('showReportDetailMap: error:', error)
		} finally {
		}
	}
}
