import client from './client'

export const activityApi = {
  listByCity: (cityId, params) =>
    client.get(`/api/cities/${cityId}/activities`, { params }).then((res) => res.data),
  get: (activityId) => client.get(`/api/activities/${activityId}`).then((res) => res.data),
}
