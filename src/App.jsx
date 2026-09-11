import React, { useEffect, useState } from "react";
import { ActivityChart } from "./components/ActivityChart.jsx";
import { AverageSessionsChart } from "./components/AverageSessionsChart.jsx";
import { Header } from "./components/Header.jsx";
import { KeyDataCard } from "./components/KeyDataCard.jsx";
import { PerformanceChart } from "./components/PerformanceChart.jsx";
import { ProfileSelection } from "./components/ProfileSelection.jsx";
import { ScoreChart } from "./components/ScoreChart.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { getUserProfile } from "./services/userService.js";

/**
 * Gère la sélection de profil, le chargement des données et les états de la page.
 * Le nettoyage de l'effet ignore les réponses obsolètes sans annuler les requêtes.
 * Ce composant racine ne reçoit aucune prop.
 * @returns {React.ReactElement} Écran de sélection ou tableau de bord SportSee.
 */
function App() {
  // Mémorise le profil sélectionné, ses données et l'état du chargement.
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("loading");

  /**
   * Efface le profil précédent avant une nouvelle sélection.
   * @param {number|null} id Identifiant choisi, ou null pour revenir au choix.
   * @returns {void}
   */
  function selectProfile(id) {
    // Efface l'ancien dashboard avant de charger le nouveau profil.
    setProfile(null);
    setStatus("loading");
    setUserId(id);
  }

  // Charge les données lorsque l'utilisateur choisit un profil.
  useEffect(() => {
    if (userId === null) return;

    let ignore = false;

    // Le service fournit un profil normalisé, prêt à transmettre aux graphiques. viens de userService.js
    getUserProfile(userId)
      .then((data) => {
        if (!ignore) {
          // Stocke les données et termine le chargement pour afficher le dashboard.
          setProfile(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (!ignore) {
          setStatus("error");
        }
      });

    // évite d’afficher les données du mauvais utilisateur quand on change de profil rapidement.
    // pour éviter qu’une ancienne réponse affiche les données du mauvais profil.
    return () => {
      ignore = true;
    };
  }, [userId]);

  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="dashboard" aria-live="polite">
        {/* Sans profil choisi, affiche la sélection ; sinon, propose de changer. */}
        {userId === null ? (
          <ProfileSelection onSelect={selectProfile} />
        ) : (
          <div className="profile-toolbar">
            <span className="demo-label">Espace de démonstration</span>
            <button
              className="profile-switch"
              type="button"
              onClick={() => selectProfile(null)}
            >
              Changer de profil
            </button>
          </div>
        )}
        {/* Affiche un retour visuel pendant le chargement ou en cas d'erreur. */}
        {userId !== null && status === "loading" && (
          <p className="state-message" role="status">
            Chargement du profil...
          </p>
        )}
        {userId !== null && status === "error" && (
          <p className="state-message state-message--error" role="alert">
            Impossible de charger les données utilisateur. Revenez au choix des
            profils pour réessayer.
          </p>
        )}
        {/* Affiche le dashboard uniquement lorsqu'un profil a été chargé. */}
        {profile && (
          <>
            <section className="intro">
              <h1>
                Bonjour <span>{profile.firstName}</span>
              </h1>
              <p>Félicitations ! Vous avez explosé vos objectifs hier 👏</p>
            </section>

            <section
              className="dashboard-grid"
              aria-label="Tableau de bord sportif"
            >
              <div className="charts">
                {/* Transmet à chaque graphique sa partie du profil via les props. */}
                <ActivityChart sessions={profile.activity} />
                <div className="small-charts">
                  <AverageSessionsChart sessions={profile.averageSessions} />
                  <PerformanceChart data={profile.performance} />
                  <ScoreChart score={profile.score} />
                </div>
              </div>

              <aside className="key-data" aria-label="Données nutritionnelles">
                {/* Réutilise la même carte  */}
                {profile.keyData.map((item) => (
                  <KeyDataCard key={item.type} item={item} />
                ))}
              </aside>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
