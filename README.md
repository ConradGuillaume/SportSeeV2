# SportSee

Page profil desktop d'une application de coaching sportif. Le frontend utilise React et Recharts pour afficher l'activité quotidienne, les durées de session, les performances, le score du jour et les chiffres nutritionnels de deux profils de démonstration : Karl (`12`) et Cecilia (`18`).

## Source des données

Le projet fonctionne avec **l'API fournie** ou avec un **mock local**. Dans cette copie, le fichier `.env.local` à la racine active l'API. Après un nouveau clonage, créer ce fichier avec :

```env
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=http://localhost:3000
```

Ce fichier n'est pas versionné. Sans `VITE_DATA_SOURCE=api`, le frontend utilise le mock. Pour passer explicitement au mock, mettre `VITE_DATA_SOURCE=mock` dans `.env.local`, puis redémarrer Vite. Pour revenir à l'API, remettre `api` et démarrer le backend. Si l'API échoue en mode `api`, l'application affiche une erreur ; elle ne bascule pas automatiquement sur le mock.

Le choix entre Karl et Cecilia sur l'écran d'accueil sert uniquement à la démonstration. Il n'y a ni authentification ni sauvegarde du choix après rechargement.

## Installer et lancer

Prérequis : Node.js et npm. Après un nouveau clonage, initialiser le backend fourni comme sous-module :

```powershell
git submodule update --init
npm.cmd install
```

Pour le **mode API**, lancer le backend dans un premier terminal :

```powershell
cd backend
npm.cmd install
npm.cmd run start
```

Il répond sur `http://localhost:3000`. Dans un second terminal, à la racine du projet :

```powershell
npm.cmd run dev
```

Ouvrir l'adresse affichée par Vite. En **mode mock**, seul le frontend doit être lancé. Sur macOS ou Linux, remplacer `npm.cmd` par `npm`.

## Comment circulent les données

1. `App.jsx` appelle `getUserProfile(userId)` dans `src/services/userService.js`.
2. `dataSource` choisit l'API ou le mock selon `VITE_DATA_SOURCE`.
3. Le service charge quatre ressources en parallèle. En mode API, `apiClient.js` effectue les appels HTTP ; en mode mock, `mockClient.js` lit `src/data/mockData.js`.
4. `normalizers.js` transforme les réponses en un profil commun. Il unifie notamment `todayScore` et `score`, prépare les jours des graphiques et les cartes nutritionnelles.
5. `App.jsx` transmet chaque partie du profil aux composants de `src/components` par les props.

| Route API | Données utilisées | Affichage |
| --- | --- | --- |
| `/user/:id` | Prénom, score, calories et nutriments | Accueil, score radial, cartes |
| `/user/:id/activity` | Poids et calories brûlées par jour | Graphique en barres |
| `/user/:id/average-sessions` | Durée des sessions par jour de semaine | Courbe |
| `/user/:id/performance` | Performances par catégorie | Radar |

Les chiffres des cartes viennent de `/user/:id`, tandis que `/activity` fournit les calories **brûlées** par jour. Le score reçu est une proportion entre 0 et 1 ; `ScoreChart` l'affiche en pourcentage. Le graphique des sessions affiche les durées fournies par l'API et ne recalcule pas de moyenne.

## Documentation et vérification

Le code contient de la JSDoc pour expliquer les fonctions et les données attendues. Les composants qui reçoivent des props déclarent des PropTypes : ils signalent les mauvais types dans la console de développement, sans corriger les réponses de l'API.

```powershell
npm.cmd run check
npm.cmd run build
```

`check` vérifie les deux profils en mode mock et API, la normalisation, les erreurs et les PropTypes. Il nécessite les dépendances du backend. `build` génère la version de production dans `dist`. Vérifier aussi visuellement les deux profils, les infobulles et la lisibilité à 1024 × 780 pixels.

Le périmètre actuel est la page profil desktop. À 1350 pixels de large ou moins, les cartes nutritionnelles passent sous les graphiques. Les autres pages de navigation, l'authentification et les versions mobile et tablette ne font pas partie de cette version.
