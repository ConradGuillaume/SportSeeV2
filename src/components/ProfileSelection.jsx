import React from 'react'
import PropTypes from 'prop-types'

// L'API fournie propose ces deux profils, sans route de liste ni authentification.
const demoProfiles = [
  { id: 12, firstName: 'Karl', initial: 'K' },
  { id: 18, firstName: 'Cecilia', initial: 'C' },
]

/**
 * Propose les deux profils de démonstration, sans authentification.
 * @param {Object} props Propriétés de l'écran de sélection.
 * @param {function(number): void} props.onSelect Callback recevant l'identifiant
 * du profil choisi : 12 pour Karl, 18 pour Cecilia.
 * @returns {React.ReactElement} Choix des profils accessible au clavier.
 */
export function ProfileSelection({ onSelect }) {
  return (
    <section className="profile-selection" aria-labelledby="profile-selection-title">
      <p className="demo-label">Bienvenue sur SportSee</p>
      <h1 id="profile-selection-title">
        Votre prochain objectif<br />
        commence <span>ici.</span>
      </h1>
      <p className="profile-selection-description">
        Retrouvez votre activité et suivez vos progrès.<br />
        Choisissez un profil pour accéder à son tableau de bord.
      </p>

      <h2>Connexion rapide</h2>
      <div className="profile-options">
        {/* Crée un bouton par profil ; onSelect transmet l'identifiant choisi à App. */}
        {demoProfiles.map(({ id, firstName, initial }) => (
          <button
            className="profile-option"
            type="button"
            key={id}
            onClick={() => onSelect(id)}
            aria-label={`Continuer avec ${firstName}`}
          >
            <span className="profile-avatar" aria-hidden="true">{initial}</span>
            <span className="profile-option-info">
              <strong>{firstName}</strong>
              <span>Voir mon tableau de bord</span>
            </span>
            <span className="profile-option-arrow" aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      <p className="profile-demo-note">Profils de démonstration · Accès sans mot de passe</p>
    </section>
  )
}

// Exige une fonction pour communiquer le choix du profil au composant parent.
ProfileSelection.propTypes = {
  onSelect: PropTypes.func.isRequired,
}
