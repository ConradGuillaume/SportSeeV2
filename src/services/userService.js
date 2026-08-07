import { fetchEndpoint } from './apiClient.js'
import {
  getMockActivity,
  getMockAverageSessions,
  getMockPerformance,
  getMockUser,
} from './mockClient.js'
import {
  normalizeActivity,
  normalizeAverageSessions,
  normalizeMainUser,
  normalizePerformance,
} from './normalizers.js'

const useApi = import.meta.env.VITE_DATA_SOURCE === 'api'

const dataSource = {
  user: (userId) => (useApi ? fetchEndpoint(`/user/${userId}`) : getMockUser(userId)),
  activity: (userId) =>
    useApi ? fetchEndpoint(`/user/${userId}/activity`) : getMockActivity(userId),
  averageSessions: (userId) =>
    useApi ? fetchEndpoint(`/user/${userId}/average-sessions`) : getMockAverageSessions(userId),
  performance: (userId) =>
    useApi ? fetchEndpoint(`/user/${userId}/performance`) : getMockPerformance(userId),
}

export async function getUserProfile(userId) {
  const [user, activity, averageSessions, performance] = await Promise.all([
    dataSource.user(userId),
    dataSource.activity(userId),
    dataSource.averageSessions(userId),
    dataSource.performance(userId),
  ])

  return {
    ...normalizeMainUser(user),
    activity: normalizeActivity(activity),
    averageSessions: normalizeAverageSessions(averageSessions),
    performance: normalizePerformance(performance),
  }
}
