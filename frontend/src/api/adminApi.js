import client from './client'

export const adminApi = {
  analytics: () => client.get('/api/admin/analytics').then((res) => res.data),
  users: (params) => client.get('/api/admin/users', { params }).then((res) => res.data),
}
