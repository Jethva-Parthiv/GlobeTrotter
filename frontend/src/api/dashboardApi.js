import client from './client'

export const dashboardApi = {
  get: () => client.get('/api/dashboard').then((res) => res.data),
}
