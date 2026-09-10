import React from 'react'
import PropTypes from 'prop-types'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

/**
 * Représente les performances par catégorie dans un radar.
 * La traduction et l'ordre des catégories sont préparés par le normaliseur.
 * @param {Object} props Propriétés du graphique.
 * @param {Array<{kind: string, value: number}>} props.data Catégories et valeurs.
 * @returns {React.ReactElement} Radar des performances.
 */
export function PerformanceChart({ data }) {
  return (
    <article className="chart-card chart-card--performance">
      <ResponsiveContainer width="100%" height={230}>
        <RadarChart data={data} outerRadius="65%">
          <PolarGrid radialLines={false} stroke="#ffffff" />
          <PolarAngleAxis dataKey="kind" tick={{ fill: '#ffffff', fontSize: 11 }} />
          <Radar dataKey="value" fill="#ff0101" fillOpacity={0.7} />
        </RadarChart>
      </ResponsiveContainer>
    </article>
  )
}

PerformanceChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      kind: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
}
