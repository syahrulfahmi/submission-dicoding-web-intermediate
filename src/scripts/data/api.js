import CONFIG from '../config';

const API_SERVICE = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  STORY: `${CONFIG.BASE_URL}/stories`,
  DETAIL_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
};

export async function login(email, password) {
  const response = await fetch(`${API_SERVICE.LOGIN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error('LOGIN_FAILED');
  }

  const user = await response.json();
  return user;
}

export async function register() {
  const fetchResponse = await fetch(API_SERVICE.LOGIN);
  return await fetchResponse.json();
}
