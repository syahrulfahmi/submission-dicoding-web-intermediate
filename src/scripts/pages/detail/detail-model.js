import { getStoryById } from '../../data/api'

export class DetailPageModel {
	async fetchStoryById(id) {
		return getStoryById(id)
	}
}
