// CSS imports
import '../styles/styles.css'

import App from './pages/app'

import './components/story-item.js'
import Camera from './utils/camera.js'

document.addEventListener('DOMContentLoaded', async () => {
	const app = new App({
		content: document.querySelector('#main-content'),
		drawerButton: document.querySelector('#drawer-button'),
		navigationDrawer: document.querySelector('#navigation-drawer'),
		skipLinkButton: document.querySelector('#skip-link'),
	})
	await app.renderPage()

	window.addEventListener('hashchange', async () => {
		await app.renderPage()
		Camera.stopAllStreams()
	})
})
