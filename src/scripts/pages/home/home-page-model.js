import { getStories } from '../../data/api'

export class HomepageModel {
	async fetchStories(page, size, location) {
		return getStories({ page: page, size: size, location: location })
	}
}
