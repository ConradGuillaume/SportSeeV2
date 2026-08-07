# SportSee

Frontend React de la page profil utilisateur SportSee, avec graphiques Recharts et couche de données séparée des composants.

## Prérequis

- Node.js
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

## Production

```powershell
npm.cmd run build
npm.cmd run preview
```

L'interface cible les écrans desktop à partir de 1024 × 780 pixels.
