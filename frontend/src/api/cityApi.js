import client from './client'

export const cityApi = {
  list: (params) => client.get('/api/cities', { params }).then((res) => res.data),
  get: (cityId) => client.get(`/api/cities/${cityId}`).then((res) => res.data),
}
