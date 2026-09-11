import { fetchEndpoint } from "./apiClient.js";
import {
  getMockActivity,
  getMockAverageSessions,
  getMockPerformance,
  getMockUser,
} from "./mockClient.js";
import {
  normalizeActivity,
  normalizeAverageSessions,
  normalizeMainUser,
  normalizePerformance,
} from "./normalizers.js";

// Choisit l'API si la configuration vaut "api" dans .env.local, sinon les données locales du mock.
const useApi = import.meta.env.VITE_DATA_SOURCE === "api";

// Propose les mêmes quatre ressources, quelle que soit la source choisie.
const dataSource = {
  user: (userId) =>
    useApi ? fetchEndpoint(`/user/${userId}`) : getMockUser(userId),
  activity: (userId) =>
    useApi
      ? fetchEndpoint(`/user/${userId}/activity`)
      : getMockActivity(userId),
  averageSessions: (userId) =>
    useApi
      ? fetchEndpoint(`/user/${userId}/average-sessions`)
      : getMockAverageSessions(userId),
  performance: (userId) =>
    useApi
      ? fetchEndpoint(`/user/${userId}/performance`)
      : getMockPerformance(userId),
};

/**
 * Profil normalisé transmis à l'interface, indépendant de la source des données.
 * @typedef {Object} UserProfile
 * @property {number} id Identifiant utilisateur.
 * @property {string} firstName Prénom affiché dans l'accueil.
 * @property {number} score Proportion entre 0 et 1.
 * @property {Array<{type: string, label: string, value: number, unit: string, tone: string}>} keyData Indicateurs nutritionnels.
 * @property {Array<{day: string, kilogram: number, calories: number}>} activity Activité quotidienne en kg et kcal.
 * @property {Array<{day: string, sessionLength: number}>} averageSessions Jours libellés et durées en minutes.
 * @property {Array<{kind: string, value: number}>} performance Catégories traduites et valeurs.
 */

/**
 * Charge les quatre ressources en parallèle, puis les normalise pour React.
 * VITE_DATA_SOURCE=api active HTTP ; toute autre valeur utilise le mock.
 * @param {number} userId Identifiant utilisateur (12 ou 18 dans les exemples).
 * @returns {Promise<UserProfile>} Profil prêt à être transmis aux composants.
 * @throws {Error} Rejette si une ressource manque ou si un appel échoue.
 * @example
 * const profile = await getUserProfile(12)
 * // profile.firstName === 'Karl', profile.score === 0.12
 */

// Centralise le chargement des données d’un utilisateur et retourne un profil normalisé.
export async function getUserProfile(userId) {
  // Lance les quatre chargements en parallèle ; une erreur fait rejeter l'ensemble.
  const [user, activity, averageSessions, performance] = await Promise.all([
    dataSource.user(userId),
    dataSource.activity(userId),
    dataSource.averageSessions(userId),
    dataSource.performance(userId),
  ]);

  // Normalise les réponses et retourne un seul objet utilisable par les composants.
  return {
    // Recopie id, firstName, score et keyData dans le profil final.
    ...normalizeMainUser(user),
    activity: normalizeActivity(activity),
    averageSessions: normalizeAverageSessions(averageSessions),
    performance: normalizePerformance(performance),
  };
}
