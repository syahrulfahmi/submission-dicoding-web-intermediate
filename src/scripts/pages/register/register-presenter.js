export class RegisterPagePresenter {
	constructor(model, view) {
		this.model = model
		this.view = view
	}

	async registerUser(username, email, password) {
		try {
			this.view.showLoading(true)
			const user = await this.model.register(username, email, password)
			this.view.registerSuccess(user)
			this.view.showLoading(false)
		} catch (error) {
			this.view.showLoading(false)
			console.info(error)
			this.view.registerError()
		}
	}
}
