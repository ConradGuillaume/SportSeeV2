import {
  USER_ACTIVITY,
  USER_AVERAGE_SESSIONS,
  USER_MAIN_DATA,
  USER_PERFORMANCE,
} from '../data/mockData.js'

/**
 * Recherche une ressource locale sans modifier les données de démonstration.
 * @template T
 * @param {Array<T>} collection Ressources à parcourir.
 * @param {number|string} userId Identifiant converti en nombre avant comparaison.
 * @param {string} [key='userId'] Nom du champ portant l'identifiant.
 * @returns {T} Ressource brute correspondant au profil.
 * @throws {Error} Si aucune ressource ne correspond à l'identifiant.
 */
function findByUserId(collection, userId, key = 'userId') {
  const item = collection.find((entry) => entry[key] === Number(userId))

  if (!item) {
    throw new Error(`No mock data for user ${userId}`)
  }

  return item
}

/**
 * Fournit le profil brut local sous forme de promesse, comme le client HTTP.
 * @param {number|string} userId Identifiant utilisateur.
 * @returns {Promise<{id: number, userInfos: {firstName: string, lastName: string, age: number}, todayScore?: number, score?: number, keyData: {calorieCount: number, proteinCount: number, carbohydrateCount: number, lipidCount: number}}>} Profil avant normalisation.
 * @throws {Error} La promesse rejette si l'utilisateur est inconnu.
 */
export async function getMockUser(userId) {
  return findByUserId(USER_MAIN_DATA, userId, 'id')
}

/**
 * Fournit l'activité quotidienne brute du profil local.
 * @param {number|string} userId Identifiant utilisateur.
 * @returns {Promise<{userId: number, sessions: Array<{day: string, kilogram: number, calories: number}>}>} Dates ISO, poids en kg et calories en kcal.
 * @throws {Error} La promesse rejette si l'utilisateur est inconnu.
 */
export async function getMockActivity(userId) {
  return findByUserId(USER_ACTIVITY, userId)
}

/**
 * Fournit les durées de session du profil local.
 * @param {number|string} userId Identifiant utilisateur.
 * @returns {Promise<{userId: number, sessions: Array<{day: number, sessionLength: number}>}>} Jours 1 à 7 et durées en minutes.
 * @throws {Error} La promesse rejette si l'utilisateur est inconnu.
 */
export async function getMockAverageSessions(userId) {
  return findByUserId(USER_AVERAGE_SESSIONS, userId)
}

/**
 * Fournit les performances brutes et la correspondance des catégories.
 * @param {number|string} userId Identifiant utilisateur.
 * @returns {Promise<{userId: number, kind: Object<number, string>, data: Array<{value: number, kind: number}>}>} Performances avant traduction.
 * @throws {Error} La promesse rejette si l'utilisateur est inconnu.
 */
export async function getMockPerformance(userId) {
  return findByUserId(USER_PERFORMANCE, userId)
}
