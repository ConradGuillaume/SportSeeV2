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

## Connexion rapide de démonstration

L'accueil propose Karl et Cecilia. Cliquer sur un profil charge son tableau de bord ; le bouton « Changer de profil » revient au choix sans redémarrer Vite. Le choix n'est pas conservé au rechargement de la page.

Il s'agit d'une sélection de profil frontend, sans mot de passe ni authentification. Les deux identités disponibles sont déclarées dans `ProfileSelection.jsx` ; leurs données sportives viennent du service mock/API existant. Aucune route backend ni dépendance supplémentaire n'est nécessaire.

Pendant le chargement ou après une erreur, le choix reste accessible. « Réessayer » relance le chargement du profil après une panne. Lors d'un changement, les anciennes données sont effacées et les réponses devenues obsolètes sont ignorées.

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

Créer un fichier `.env.local` à la racine :

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000
```

Puis relancer le frontend.

Pour afficher Cecilia, la sélectionner sur l'écran de connexion rapide. L'ancienne variable `VITE_USER_ID` n'est plus utilisée : l'identifiant est maintenant choisi dans l'interface.

| Variable | Valeur par défaut | Rôle |
| --- | --- | --- |
| `VITE_DATA_SOURCE` | mock | Seule la valeur `api` active les appels HTTP. |
| `VITE_API_BASE_URL` | `http://localhost:3000` | URL du backend, sans slash final. |

Les variables sont lues par Vite : redémarrer le serveur après modification et reconstruire le projet pour une version de production. Le fichier `.env` est ignoré par Git. Les variables `VITE_*` sont exposées au navigateur et ne doivent pas contenir de secrets.

## Architecture

- `src/services/userService.js` orchestre les appels de données.
- `src/services/apiClient.js` contient les appels HTTP.
- `src/services/mockClient.js` fournit les données mockées.
- `src/services/normalizers.js` standardise les données avant utilisation par React.
- `src/components` contient les composants UI et graphiques.

## Flux de données

1. `ProfileSelection.jsx` transmet l'identifiant choisi à `App.jsx`, qui le conserve dans son state.
2. L'effet de `App.jsx` demande le profil au service lorsque l'identifiant change ou qu'un nouvel essai est demandé.
3. `userService.js` sélectionne le mock ou l'API selon `VITE_DATA_SOURCE`.
4. Les quatre ressources sont chargées en parallèle.
5. `normalizers.js` retourne un modèle unique aux composants React.

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

Les contrats des services et des composants sont documentés en JSDoc dans le code. Avant de proposer une modification, lancer `npm.cmd run check` et `npm.cmd run build`, puis vérifier les deux profils et les infobulles dans le navigateur.

Le périmètre actuel couvre la page profil desktop. Les liens horizontaux pointent vers la page racine et les boutons verticaux ne déclenchent pas encore de navigation vers d'autres écrans.

## Documentation du code et PropTypes

Le README explique l'installation et l'organisation du projet. La JSDoc décrit les responsabilités, paramètres, unités, retours et erreurs des fonctions. Elle couvre les composants, leurs infobulles et curseurs, les services, les normaliseurs et les callbacks de sélection/rechargement. Le type `UserProfile`, défini dans `userService.js`, décrit le contrat normalisé du tableau de bord.

Pour consulter cette documentation, ouvrir la fonction dans le code ou la survoler dans un éditeur compatible comme VS Code. La documentation JSDoc est conservée dans les sources ; aucun site HTML de documentation n'est généré automatiquement.

`prop-types` est une dépendance directe du frontend. Chaque composant qui reçoit des props déclare son contrat :

| Composant | Props attendues |
| --- | --- |
| `ActivityChart` | `sessions` : tableau de journées avec `day` (texte), `kilogram` et `calories` (nombres). |
| `AverageSessionsChart` | `sessions` : tableau avec `day` (texte) et `sessionLength` (nombre de minutes). |
| `PerformanceChart` | `data` : tableau avec `kind` (texte) et `value` (nombre). |
| `ScoreChart` | `score` : nombre obligatoire ; sa plage 0–1 est gérée par la normalisation. |
| `KeyDataCard` | `item` : type d'indicateur autorisé, libellé, valeur numérique et unité `g` ou `kCal`. |
| `ProfileSelection` | `onSelect` : fonction obligatoire, appelée avec l'identifiant choisi. |

Les tableaux utilisent `arrayOf(shape(...))` pour vérifier aussi leurs champs internes. Les infobulles et le curseur possèdent leurs PropTypes ; les props injectées par Recharts restent optionnelles à la création de ces éléments. `App`, `Header` et `Sidebar` ne reçoivent pas de props et n'ont donc pas besoin d'une déclaration vide.

Exemple dans `ScoreChart.jsx` :

```jsx
/**
 * @param {Object} props Propriétés du graphique.
 * @param {number} props.score Proportion normalisée entre 0 et 1.
 * @returns {React.ReactElement} Graphique du score.
 */
export function ScoreChart({ score }) {
  // Conversion en pourcentage et rendu du graphique.
}

ScoreChart.propTypes = {
  score: PropTypes.number.isRequired,
}
```

La JSDoc documente le contrat ; les PropTypes signalent les mauvais types dans la console en développement avec React 18. Ils ne corrigent pas les valeurs, ne bloquent pas l'application et ne remplacent ni la normalisation ni une validation exhaustive des réponses API.

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

Il vérifie aussi que les profils normalisés respectent les PropTypes des six composants recevant des données, et que des props absentes, des champs imbriqués mal typés ou des valeurs hors des listes autorisées déclenchent les avertissements attendus. Ces avertissements de test sont capturés pour ne pas polluer la console.

La validation visuelle reste à effectuer dans le navigateur à 1024 × 780 et sur un écran plus large : lisibilité, infobulles au survol et conformité à la maquette Figma.
