import client from './client'

export const tripApi = {
  list: (sort = 'upcoming') =>
    client.get('/api/trips', { params: { sort } }).then((res) => res.data),
  get: (tripId) => client.get(`/api/trips/${tripId}`).then((res) => res.data),
  create: (payload) => client.post('/api/trips', payload).then((res) => res.data),
  update: (tripId, payload) =>
    client.patch(`/api/trips/${tripId}`, payload).then((res) => res.data),
  remove: (tripId) => client.delete(`/api/trips/${tripId}`),
  copy: (tripId) => client.post(`/api/trips/${tripId}/copy`).then((res) => res.data),
}
