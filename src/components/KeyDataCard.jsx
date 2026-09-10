import React from 'react'
import PropTypes from 'prop-types'
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

/**
 * Affiche un indicateur nutritionnel avec son icône, sa valeur et son unité.
 * @param {Object} props Propriétés de la carte.
 * @param {Object} props.item Indicateur normalisé depuis la ressource utilisateur.
 * @param {'calories'|'proteins'|'carbs'|'lipids'} props.item.type Clé de l'icône.
 * @param {string} props.item.label Libellé affiché.
 * @param {number} props.item.value Quantité, formatée avec la locale en-US.
 * @param {'kCal'|'g'} props.item.unit Unité affichée après la valeur.
 * @returns {React.ReactElement} Carte nutritionnelle.
 */
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

KeyDataCard.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.oneOf(['calories', 'proteins', 'carbs', 'lipids']).isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    unit: PropTypes.oneOf(['kCal', 'g']).isRequired,
  }).isRequired,
}
