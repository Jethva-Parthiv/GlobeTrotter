import client from './client'

export const authApi = {
  signup: (payload) => client.post('/api/auth/signup', payload).then((res) => res.data),
  login: (payload) => client.post('/api/auth/login', payload).then((res) => res.data),
  forgotPassword: (payload) =>
    client.post('/api/auth/forgot-password', payload).then((res) => res.data),
}
