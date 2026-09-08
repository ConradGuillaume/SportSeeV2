# SportSee

Frontend React de la page profil utilisateur SportSee, avec graphiques Recharts et couche de données séparée des composants.

## Prérequis

- Node.js
- npm (fourni avec Node.js)
- Le backend OpenClassrooms est déjà présent dans `backend`

## Installation

```powershell
npm.cmd install
git submodule update --init
```

## Lancer le frontend

```powershell
npm.cmd run dev
```

Le frontend démarre par défaut avec les données mockées. Les utilisateurs disponibles sont `12` et `18`.

## Lancer le backend

Dans un second terminal :

```powershell
cd backend
npm.cmd install
npm.cmd run start
```

L'API expose notamment :

- `http://localhost:3000/user/12`
- `http://localhost:3000/user/12/activity`
- `http://localhost:3000/user/12/average-sessions`
- `http://localhost:3000/user/12/performance`

## Utiliser l'API au lieu du mock

Créer un fichier `.env` à la racine :

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000
VITE_USER_ID=12
```

Puis relancer le frontend.

Pour afficher Cecilia, remplacer `VITE_USER_ID=12` par `VITE_USER_ID=18`. Le choix du profil se fait par configuration, pas par une route du frontend.

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | mock | Seule la valeur `api` active les appels HTTP. |
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL du backend, sans slash final. |
| `VITE_USER_ID` | `12` | Identifiant du profil à afficher. |

Les variables sont lues par Vite : redémarrer le serveur après modification et reconstruire le projet pour une version de production. Le fichier `.env` est ignoré par Git. Les variables `VITE_*` sont exposées au navigateur et ne doivent pas contenir de secrets.

## Architecture

- `src/services/userService.js` orchestre les appels de données.
- `src/services/apiClient.js` contient les appels HTTP.
- `src/services/mockClient.js` fournit les données mockées.
- `src/services/normalizers.js` standardise les données avant utilisation par React.
- `src/components` contient les composants UI et graphiques.

## Flux de données

1. `App.jsx` demande un profil au service.
2. `userService.js` sélectionne le mock ou l'API selon `VITE_DATA_SOURCE`.
3. Les quatre ressources sont chargées en parallèle.
4. `normalizers.js` retourne un modèle unique aux composants React.

La normalisation gère notamment la différence de schéma entre `todayScore` et `score` selon l'utilisateur, traduit les catégories de performance et prépare les cartes nutritionnelles.

| Route API | Données normalisées | Composant |
| --- | --- | --- |
| `/user/:id` | `firstName`, `score`, `keyData` | Accueil du profil, `ScoreChart`, `KeyDataCard` |
| `/user/:id/activity` | `activity` : jour du mois, poids en kg, calories | `ActivityChart` |
| `/user/:id/average-sessions` | `averageSessions` : jour de la semaine, durée en minutes | `AverageSessionsChart` |
| `/user/:id/performance` | `performance` : catégorie traduite, valeur | `PerformanceChart` |

Les chiffres nutritionnels viennent de `/user/:id`, et non de la route `/activity`. Le score normalisé est une proportion entre 0 et 1 ; le composant le convertit en pourcentage. Les fonctions de normalisation attendent la structure du backend fourni, sans valider exhaustivement chaque champ.

Si un des quatre chargements échoue, le profil entier passe en erreur et `App.jsx` affiche « Impossible de charger les données utilisateur. ». Il n'y a pas de retour automatique aux mocks en cas de panne API.

## Contribuer

Pour modifier l'affichage, intervenir dans `src/components` et `src/styles/index.css`. Pour adapter une réponse API, modifier d'abord `src/services/normalizers.js` ; les composants reçoivent uniquement le modèle normalisé. Les données de démonstration sont dans `src/data/mockData.js`.

Les contrats des services principaux sont documentés en JSDoc dans le code. Avant de proposer une modification, lancer `npm.cmd run check` et `npm.cmd run build`, puis vérifier les deux profils et les infobulles dans le navigateur.

Le périmètre actuel couvre la page profil desktop. Les liens horizontaux pointent vers la page racine et les boutons verticaux ne déclenchent pas encore de navigation vers d'autres écrans.

## Dépannage

- Profil en erreur : vérifier que le backend fonctionne sur le port 3000, que `VITE_API_BASE_URL` correspond à son adresse et que l'identifiant vaut 12 ou 18.
- Données inchangées : vérifier `VITE_DATA_SOURCE=api`, puis redémarrer Vite.
- Backend absent après clonage : lancer `git submodule update --init`, puis installer ses dépendances dans `backend`.
- Port frontend occupé : ouvrir l'URL effectivement affichée par Vite, qui peut choisir un autre port.

## Production

```powershell
npm.cmd run build
npm.cmd run preview
```

L'interface cible les écrans desktop à partir de 1024 × 780 pixels.

Sur les écrans de 1350 pixels de large ou moins, les cartes nutritionnelles passent sous les graphiques pour préserver leur lisibilité. Le défilement vertical reste possible.

## Vérification

```powershell
npm.cmd run check
```

Ce contrôle nécessite les dépendances du backend. Il démarre temporairement les routes du backend sur un port libre, puis vérifie les profils 12 et 18 en mock et via HTTP, les deux formats de score, les jours du calendrier et les erreurs (utilisateur inconnu et API arrêtée). Le serveur de test est fermé automatiquement.

La validation visuelle reste à effectuer dans le navigateur à 1024 × 780 et sur un écran plus large : lisibilité, infobulles au survol et conformité à la maquette Figma.
