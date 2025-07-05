import { register } from '../../data/api'

export class RegisterModel {
	async register(username, email, password) {
		return register(username, email, password)
	}
}
