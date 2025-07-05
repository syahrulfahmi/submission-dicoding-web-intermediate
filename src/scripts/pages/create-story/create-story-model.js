import { storeNewStory } from '../../data/api'

export class CreateStoryModel {
	async postNewStory({ description, photo, lat, lon }) {
		return storeNewStory({ description, photo, lat, lon })
	}
}
