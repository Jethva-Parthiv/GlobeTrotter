import client from './client'

export const stopApi = {
  list: (tripId) => client.get(`/api/trips/${tripId}/stops`).then((res) => res.data),
  create: (tripId, payload) =>
    client.post(`/api/trips/${tripId}/stops`, payload).then((res) => res.data),
  update: (tripId, stopId, payload) =>
    client.patch(`/api/trips/${tripId}/stops/${stopId}`, payload).then((res) => res.data),
  remove: (tripId, stopId) => client.delete(`/api/trips/${tripId}/stops/${stopId}`),
  reorder: (tripId, stopOrders) =>
    client
      .patch(`/api/trips/${tripId}/stops/reorder`, { stop_orders: stopOrders })
      .then((res) => res.data),
  addActivity: (tripId, stopId, payload) =>
    client
      .post(`/api/trips/${tripId}/stops/${stopId}/activities`, payload)
      .then((res) => res.data),
  listActivities: (tripId, stopId) =>
    client.get(`/api/trips/${tripId}/stops/${stopId}/activities`).then((res) => res.data),
  updateActivity: (tripId, stopId, stopActivityId, payload) =>
    client
      .patch(`/api/trips/${tripId}/stops/${stopId}/activities/${stopActivityId}`, payload)
      .then((res) => res.data),
  removeActivity: (tripId, stopId, stopActivityId) =>
    client.delete(`/api/trips/${tripId}/stops/${stopId}/activities/${stopActivityId}`),
}
