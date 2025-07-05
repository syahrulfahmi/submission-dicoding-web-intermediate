import routes from '../routes/routes'
import { getActiveRoute } from '../routes/url-parser'
import { navigateTo, setupSkipToContent, transitionHelper } from '../utils'
import 'leaflet/dist/leaflet.css'
import { isAuthenticated, removeAccessToken } from '../utils/auth'

class App {
	#content = null
	#drawerButton = null
	#navigationDrawer = null
	#skipLinkButton = null

	constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
		this.#content = content
		this.#drawerButton = drawerButton
		this.#navigationDrawer = navigationDrawer
		this.#skipLinkButton = skipLinkButton

		this.#init()
	}

	#init() {
		setupSkipToContent(this.#skipLinkButton, this.#content)
	}

	#setupDrawer() {
		this.#drawerButton.addEventListener('click', () => {
			this.#navigationDrawer.classList.toggle('open')
		})

		document.body.addEventListener('click', (event) => {
			if (
				!this.#navigationDrawer.contains(event.target) &&
				!this.#drawerButton.contains(event.target)
			) {
				this.#navigationDrawer.classList.remove('open')
			}

			this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
				if (link.contains(event.target)) {
					this.#navigationDrawer.classList.remove('open')
				}
			})
		})
	}

	async renderPage() {
		const url = getActiveRoute()
		const route = routes[url]
		const page = route()

		const transition = transitionHelper({
			updateDOM: async () => {
				this.#content.innerHTML = await page.render()
				await page.afterRender()
			},
		})
		transition.ready.catch(console.error)
		this.updateNav()
		transition.updateCallbackDone.then(() => {
			scrollTo({ top: 0, behavior: 'instant' })
			this.#setupDrawer()
		})
	}

	updateNav() {
		const navList = document.getElementById('nav-list')

		if (!navList) return

		navList.innerHTML = ''

		if (isAuthenticated()) {
			navList.innerHTML = `
        <li>
          <a href="#/create-story" class="btn"><i class="fas fa-plus"></i>Buat Story</a></li>
        <li>
          <a href="#" id="logout-button" class="btn btn-outline"><i class="fas fa-sign-out-alt"></i>Logout</a>
        </li>
      `
		} else {
			navList.innerHTML = `
        <li><a href="#/login" class="btn">Login</a></li>
        <li><a href="#/register" class="btn">Register</a></li>
      `
		}

		const logoutBtn = document.getElementById('logout-button')
		if (logoutBtn) {
			logoutBtn.addEventListener('click', (e) => {
				e.preventDefault()
				this.showLogoutConfirmation()
			})
		}
	}

	showLogoutConfirmation() {
		const yakin = confirm('Apakah kamu yakin ingin logout?')

		if (yakin) {
			removeAccessToken()
			this.updateNav()
			navigateTo('/login')
		}
	}
}

export default App
