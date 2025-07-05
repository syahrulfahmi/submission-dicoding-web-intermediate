import { putAccessToken } from '../../utils/auth'

export class LoginPagePresenter {
	constructor(model, view) {
		this.model = model
		this.view = view
	}

	async loginUser(username, password) {
		try {
			this.view.showLoading(true)
			const user = await this.model.login(username, password)
			this.view.renderLoginSuccess(user)
			putAccessToken(user.loginResult.token)
			this.view.showLoading(false)
		} catch (error) {
			this.view.renderLoginError(error)
			this.view.showLoading(false)
		}
	}
}
