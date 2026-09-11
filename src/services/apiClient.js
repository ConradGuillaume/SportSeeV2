// Lit l'adresse configurée du backend, ou utilise le serveur local par défaut.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

/**
 * Lit une ressource et retire l'enveloppe JSON { data: ... } du backend.
 * @param {string} path Chemin commencant par /, par exemple /user/12/activity.
 * @returns {Promise<unknown>} Donnees brutes, a normaliser avant affichage.
 * @throws {Error} Rejette en cas d'erreur HTTP, reseau ou de JSON invalide.
 */
export async function fetchEndpoint(path) {
  // Envoie une requête GET et attend la réponse
  const response = await fetch(`${API_BASE_URL}${path}`);

  // Si le serveur répond avec une erreur, arrête le chargement et signale l'échec.
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  // Convertit le JSON en objet JavaScript
  const payload = await response.json();
  return payload.data;
}
