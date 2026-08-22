import client from './client'

export const publicApi = {
  listTrips: (params) => client.get('/api/public/trips', { params }).then((res) => res.data),
  getTrip: (tripId) => client.get(`/api/public/trips/${tripId}`).then((res) => res.data),
}
