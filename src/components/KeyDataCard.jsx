import React from 'react'
import burgerIcon from '../assets/images/burger.png'
import caloriesIcon from '../assets/images/flamme.png'
import carbsIcon from '../assets/images/pomme.png'
import proteinsIcon from '../assets/images/prot.png'

const iconByType = {
  calories: caloriesIcon,
  proteins: proteinsIcon,
  carbs: carbsIcon,
  lipids: burgerIcon,
}

export function KeyDataCard({ item }) {
  const formattedValue = new Intl.NumberFormat('en-US').format(item.value)
  const icon = iconByType[item.type]

  return (
    <article className="key-card">
      <img className="key-icon" src={icon} alt="" />
      <div>
        <strong>
          {formattedValue}
          {item.unit}
        </strong>
        <span>{item.label}</span>
      </div>
    </article>
  )
}
