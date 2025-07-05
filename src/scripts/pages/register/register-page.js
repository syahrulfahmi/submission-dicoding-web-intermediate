import { navigateTo } from '../../utils'
import { RegisterModel } from './register-model'
import { RegisterPagePresenter } from './register-presenter'

export default class RegisterPage {
	async render() {
		return `
      <div class="register-container">
        <div class="register-box">
          <h2>Daftar</h2>
          <form>
            <div class="form-control">
              <label for="username">Name</label>
              <input type="text" id="username" name="username" placeholder="Name" required autocomplete=off />
            </div>
            <div class="form-control">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" required autocomplete=off />
            </div>
            <div class="form-control>
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Kata Sandi" required autocomplete=off />
            </div>
            <button id="loadingBtn" class="btn width-100">
              <span class="spinner hidden"></span>
              <span class="btn-text">Daftar</span>
            </button>
          </form>
          <div class="register-link">
            Sudah punya akun? <a href="#/login">Masuk</a>
          </div>
        </div>
      </div>
    `
	}

	async afterRender() {
		const model = new RegisterModel()
		const presenter = new RegisterPagePresenter(model, this)

		const registerForm = document.querySelector('form')

		registerForm.addEventListener('submit', async (event) => {
			const username = document.getElementById('username').value
			const email = document.getElementById('email').value
			const password = document.getElementById('password').value

			event.preventDefault()
			await presenter.registerUser(username, email, password)
		})
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

		btnText.textContent = 'Daftar'
		spinner.classList.add('hidden')
		button.disabled = false
	}

	registerSuccess() {
		navigateTo('/login')
	}

	registerError() {}
}
