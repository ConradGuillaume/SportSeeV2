import React from 'react'
import musculationIcon from '../assets/images/musculation.png'
import natationIcon from '../assets/images/natation.png'
import veloIcon from '../assets/images/velo.png'
import yogaIcon from '../assets/images/yoga.png'

const activities = [
  { label: 'Yoga', icon: yogaIcon },
  { label: 'Natation', icon: natationIcon },
  { label: 'Cyclisme', icon: veloIcon },
  { label: 'Musculation', icon: musculationIcon },
]

/**
 * Affiche les activités et le copyright, sans props.
 * Les boutons d'activité n'ouvrent pas encore d'autres écrans.
 * @returns {React.ReactElement} Barre latérale de navigation.
 */
export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Activités">
      <nav className="activity-nav">
        {activities.map(({ label, icon }) => (
          <button key={label} type="button" aria-label={label}>
            <span aria-hidden="true">
              <img src={icon} alt="" />
            </span>
          </button>
        ))}
      </nav>
      <p className="copyright">Copyright SportSee 2020</p>
    </aside>
  )
}
