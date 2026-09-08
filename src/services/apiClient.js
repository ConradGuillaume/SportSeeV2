const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

/**
 * Lit une ressource et retire l'enveloppe JSON { data: ... } du backend.
 * @param {string} path Chemin commencant par /, par exemple /user/12/activity.
 * @returns {Promise<unknown>} Donnees brutes, a normaliser avant affichage.
 * @throws {Error} Rejette en cas d'erreur HTTP, reseau ou de JSON invalide.
 */
export async function fetchEndpoint(path) {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  const payload = await response.json()
  return payload.data
}
