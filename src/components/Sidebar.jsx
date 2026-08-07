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
