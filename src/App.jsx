import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ActivityChart } from './components/ActivityChart.jsx'
import { AverageSessionsChart } from './components/AverageSessionsChart.jsx'
import { Header } from './components/Header.jsx'
import { KeyDataCard } from './components/KeyDataCard.jsx'
import { PerformanceChart } from './components/PerformanceChart.jsx'
import { ProfileSelection } from './components/ProfileSelection.jsx'
import { ScoreChart } from './components/ScoreChart.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { getUserProfile } from './services/userService.js'

/**
 * Gère la sélection de profil, le chargement des données et les états de la page.
 * Le nettoyage de l'effet ignore les réponses obsolètes sans annuler les requêtes.
 * Ce composant racine ne reçoit aucune prop.
 * @returns {React.ReactElement} Écran de sélection ou tableau de bord SportSee.
 */
function App() {
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')
  const [retryCount, setRetryCount] = useState(0)
  const profileHeading = useRef(null)

  /**
   * Efface le profil précédent avant une nouvelle sélection.
   * @param {number|null} id Identifiant choisi, ou null pour revenir au choix.
   * @returns {void}
   */
  function selectProfile(id) {
    setProfile(null)
    setStatus('loading')
    setUserId(id)
  }

  /**
   * Déclenche un nouvel essai pour le même identifiant après une erreur.
   * @returns {void}
   */
  function retryLoading() {
    setStatus('loading')
    setRetryCount((count) => count + 1)
  }

  useEffect(() => {
    if (userId === null) return

    let ignore = false

    getUserProfile(userId)
      .then((data) => {
        if (!ignore) {
          setProfile(data)
          setStatus('success')
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus('error')
        }
      })

    return () => {
      ignore = true
    }
  }, [userId, retryCount])

  useEffect(() => {
    if (status === 'success') profileHeading.current?.focus()
  }, [status])

  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="dashboard" aria-live="polite">
        {userId === null ? (
          <ProfileSelection onSelect={selectProfile} />
        ) : (
          <div className="profile-toolbar">
            <span className="demo-label">Espace de démonstration</span>
            <button className="profile-switch" type="button" onClick={() => selectProfile(null)}>
              Changer de profil
            </button>
          </div>
        )}
        {userId !== null && status === 'loading' && (
          <p className="state-message" role="status">Chargement du profil...</p>
        )}
        {userId !== null && status === 'error' && (
          <section className="profile-error">
            <p className="state-message state-message--error" role="alert">
              Impossible de charger les données utilisateur.
            </p>
            <p>Réessayez dans un instant ou choisissez un autre profil.</p>
            <button className="profile-retry" type="button" onClick={retryLoading}>
              Réessayer
            </button>
          </section>
        )}
        {profile && (
          <>
            <section className="intro">
              <h1 ref={profileHeading} tabIndex={-1}>
                Bonjour <span>{profile.firstName}</span>
              </h1>
              <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
            </section>

            <section className="dashboard-grid" aria-label="Tableau de bord sportif">
              <div className="charts">
                <ActivityChart sessions={profile.activity} />
                <div className="small-charts">
                  <AverageSessionsChart sessions={profile.averageSessions} />
                  <PerformanceChart data={profile.performance} />
                  <ScoreChart score={profile.score} />
                </div>
              </div>

              <aside className="key-data" aria-label="Données nutritionnelles">
                {profile.keyData.map((item) => (
                  <KeyDataCard key={item.type} item={item} />
                ))}
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default App
