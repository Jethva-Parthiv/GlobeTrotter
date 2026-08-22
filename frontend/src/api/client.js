import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'globetrotter_access_token'

export function getAccessToken() {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setAccessToken(token) {
  if (!token) {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAccessToken()
      window.dispatchEvent(new CustomEvent('globetrotter:unauthorized'))
    }

    return Promise.reject(error)
  },
)

export default client
