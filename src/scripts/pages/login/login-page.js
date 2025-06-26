import { LoginModel } from './login-model.js';
import { LoginPagePresenter } from './login-presenter.js';
import loginPageStyle from './loginPageStyle.js';

export default class LoginPage {
  async render() {
    return `
      <div class="login-container">
        <h2>Masuk</h2>
        <form id="login-form">
          <div class="form-control">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Email" required />
          </div>
          <div class="form-control>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Kata Sandi" required />
          </div>
          <button type="submit">Masuk</button>
        </form>
        <div class="register-link">
          Belum punya akun? <a href="#/register">Daftar</a>
        </div>
      </div>
    `;
  }

  updateStyle() {
    if ('adoptedStyleSheets' in document) {
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        loginPageStyle,
      ];
    } else {
      const style = document.createElement('style');
      style.textContent = loginPageStyle.cssRules
        ? Array.from(loginPageStyle.cssRules)
            .map((rule) => rule.cssText)
            .join('\n')
        : '';
      document.head.appendChild(style);
    }
  }

  async afterRender() {
    this.updateStyle();

    const model = new LoginModel();
    const presenter = new LoginPagePresenter(model, this);

    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async (event) => {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      event.preventDefault();
      console.log(email, password);
      await presenter.loginUser(email, password);
    });
  }

  showLoading() {
    // const container = document.getElementById('container');
    // container.innerText = 'Memproses login...';
  }

  renderLoginSuccess(user) {
    // const container = document.getElementById('container');
    // container.innerText = `Selamat datang, ${user.name}!`;
  }

  renderLoginError() {
    // const container = document.getElementById('container');
    // container.innerText = 'Login gagal. Cek kembali username dan password.';
  }
}
