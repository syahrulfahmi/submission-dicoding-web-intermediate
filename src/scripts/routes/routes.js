import {
	checkAuthenticatedRoute,
	checkUnauthenticatedRouteOnly,
} from '../utils/auth'
import HomePage from '../pages/home/home-page'
import AboutPage from '../pages/about/about-page'
import LoginPage from '../pages/login/login-page'
import RegisterPage from '../pages/register/register-page'
import DetailPage from '../pages/detail/detail-page'
import CreateStoryPage from '../pages/create-story/create-story-page'

const routes = {
	'/about': new AboutPage(),
	'/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
	'/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),

	'/': () => checkAuthenticatedRoute(new HomePage()),
	'/story/:id': () => checkAuthenticatedRoute(new DetailPage()),
	'/create-story': () => checkAuthenticatedRoute(new CreateStoryPage()),
}

export default routes
