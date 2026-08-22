import client from './client'

export const userApi = {
  me: () => client.get('/api/users/me').then((res) => res.data),
  updateMe: (payload) => client.patch('/api/users/me', payload).then((res) => res.data),
  deleteMe: () => client.delete('/api/users/me'),
}
