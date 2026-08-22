import client from './client'

export const budgetApi = {
  get: (tripId) => client.get(`/api/trips/${tripId}/budget`).then((res) => res.data),
  daily: (tripId) => client.get(`/api/trips/${tripId}/budget/daily`).then((res) => res.data),
}
