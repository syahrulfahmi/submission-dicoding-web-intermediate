import CONFIG from '../config'
import { getAccessToken } from '../utils/auth'

const API_SERVICE = {
	LOGIN: `${CONFIG.BASE_URL}/login`,
	REGISTER: `${CONFIG.BASE_URL}/register`,
	STORY: `${CONFIG.BASE_URL}/stories`,
	DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
}

export async function login(email, password) {
	const response = await fetch(`${API_SERVICE.LOGIN}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})

	if (!response.ok) {
		throw new Error('LOGIN_FAILED')
	}

	const data = await response.json()
	return data
}

export async function getStories({ page = null, size = null, location = 1 }) {
	const params = new URLSearchParams({
		location: location,
	})
	const response = await fetch(`${API_SERVICE.STORY}?${params}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getAccessToken()}`,
		},
	})

	if (!response.ok) {
		throw new Error('FETCH STORY FAILED')
	}

	const data = await response.json()
	return data
}

export async function getStoryById(id) {
	const response = await fetch(`${API_SERVICE.DETAIL_STORY(id)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${getAccessToken()}`,
		},
	})

	if (!response.ok) {
		throw new Error('FETCH STORY FAILED')
	}

	const data = await response.json()
	return data
}

export async function storeNewStory({ description, photo, lat, lon }) {
	const accessToken = getAccessToken()

	const formData = new FormData()

	formData.set('description', description)
	formData.set('photo', photo)
	formData.set('lat', lat)
	formData.set('lon', lon)

	const response = await fetch(API_SERVICE.STORY, {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: formData,
	})

	const data = await response.json()
	return data
}

export async function register(username, email, password) {
	const response = await fetch(`${API_SERVICE.REGISTER}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name: username, email: email, password: password }),
	})

	if (!response.ok) {
		throw new Error('REGISTER_FAILED')
	}

	const data = await response.json()
	return data
}

export async function dummy() {
	const fetchResponse = await fetch(API_SERVICE.LOGIN)
	return await fetchResponse.json()
}
