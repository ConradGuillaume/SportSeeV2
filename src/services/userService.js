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

/**
 * Charge les quatre ressources en parallele, puis les normalise pour React.
 * VITE_DATA_SOURCE=api active HTTP ; toute autre valeur utilise le mock.
 * @param {number} userId Identifiant utilisateur (12 ou 18 dans les exemples).
 * @returns {Promise<ReturnType<typeof normalizeMainUser> & {
 *   activity: ReturnType<typeof normalizeActivity>,
 *   averageSessions: ReturnType<typeof normalizeAverageSessions>,
 *   performance: ReturnType<typeof normalizePerformance>
 * }>}
 * @throws {Error} Rejette si une ressource manque ou si un appel echoue.
 */
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
