import { navigateTo } from '../../utils/index.js'
import { LoginModel } from './login-model.js'
import { LoginPagePresenter } from './login-presenter.js'

export default class LoginPage {
	async render() {
		return `
      <div class="login-container">
        <div class="login-box">
          <h2>Masuk</h2>
          <form id="login-form">
            <div class="form-control">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required />
            </div>
            <div class="form-control>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Kata Sandi" autocomplete="off" required />
            </div>
            <button id="loadingBtn" class="btn width-100">
              <span class="spinner hidden"></span>
              <span class="btn-text">Masuk</span>
            </button>
          </form>
          <div class="register-link">
            Belum punya akun? <a href="#/register">Daftar</a>
          </div>
        </div>
      </div>
    `
	}

	async afterRender() {
		const model = new LoginModel()
		const presenter = new LoginPagePresenter(model, this)

		const loginForm = document.querySelector('form')

		loginForm.addEventListener('submit', async (event) => {
			const email = document.getElementById('email').value
			const password = document.getElementById('password').value

			event.preventDefault()
			await presenter.loginUser(email, password)
		})
	}

	renderLoginSuccess(user) {
		navigateTo('/')
	}

	renderLoginError(message) {
		alert(message)
	}

	showLoading(isLoading = true) {
		const button = document.getElementById('loadingBtn')
		const btnText = button.querySelector('.btn-text')
		const spinner = button.querySelector('.spinner')

		if (isLoading) {
			button.disabled = true
			btnText.textContent = 'Loading...'
			spinner.classList.remove('hidden')
			return
		}

		btnText.textContent = 'Masuk'
		spinner.classList.add('hidden')
		button.disabled = false
	}
}
