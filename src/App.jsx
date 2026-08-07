import React from 'react'
import { useEffect, useState } from 'react'
import { ActivityChart } from './components/ActivityChart.jsx'
import { AverageSessionsChart } from './components/AverageSessionsChart.jsx'
import { Header } from './components/Header.jsx'
import { KeyDataCard } from './components/KeyDataCard.jsx'
import { PerformanceChart } from './components/PerformanceChart.jsx'
import { ScoreChart } from './components/ScoreChart.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { getUserProfile } from './services/userService.js'

const USER_ID = Number(import.meta.env.VITE_USER_ID ?? 12)

function App() {
  const [profile, setProfile] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let ignore = false

    getUserProfile(USER_ID)
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
  }, [])

  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="dashboard" aria-live="polite">
        {status === 'loading' && <p className="state-message">Chargement du profil...</p>}
        {status === 'error' && (
          <p className="state-message state-message--error">
            Impossible de charger les données utilisateur.
          </p>
        )}
        {profile && (
          <>
            <section className="intro">
              <h1>
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
