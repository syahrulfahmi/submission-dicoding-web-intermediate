export class LoginPagePresenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  async loginUser(username, password) {
    try {
      this.view.showLoading();
      console.log(username, password);
      const user = await this.model.login(username, password);
      this.view.renderLoginSuccess(user);
    } catch (error) {
      this.view.renderLoginError();
    }
  }
}
