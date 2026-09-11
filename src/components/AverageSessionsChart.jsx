import React from 'react'
import PropTypes from 'prop-types'
import {
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

/**
 * Affiche la durée de session au survol.
 * @param {Object} props Propriétés injectées par Recharts.
 * @param {boolean} [props.active] État du survol.
 * @param {Array<{value: number}>} [props.payload] Durée de session en minutes.
 * @returns {React.ReactElement|null} Infobulle ou rien hors survol.
 */
function SessionsTooltip({ active, payload }) {
  // Affiche en minutes la valeur fournie par Recharts pour le jour survolé.
  if (!active || !payload?.length) return null

  return <div className="sessions-tooltip">{payload[0].value} min</div>
}

SessionsTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.number.isRequired })),
}

/**
 * Assombrit la partie du graphique située à droite du point survolé.
 * Ces props sont optionnelles à la création, puis injectées par Recharts.
 * @param {Object} props Géométrie du curseur.
 * @param {Array<{x: number, y: number}>} [props.points] Coordonnées du survol.
 * @param {number} [props.width] Largeur fournie par Recharts, en pixels.
 * @param {number} [props.height] Hauteur fournie par Recharts, en pixels.
 * @returns {React.ReactElement} Rectangle de surbrillance.
 */
function SessionsCursor({ points, width, height }) {
  // Récupère la position du survol pour assombrir la zone située à sa droite.
  const x = points?.[0]?.x ?? 0
  return <Rectangle fill="rgba(0, 0, 0, 0.12)" x={x} y={0} width={width - x} height={height} />
}

SessionsCursor.propTypes = {
  points: PropTypes.arrayOf(
    PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  ),
  width: PropTypes.number,
  height: PropTypes.number,
}

/**
 * Trace les durées fournies par le service, sans recalculer leur moyenne.
 * @param {Object} props Propriétés du graphique.
 * @param {Array<{day: string, sessionLength: number}>} props.sessions
 * Jours de la semaine normalisés et durées en minutes.
 * @returns {React.ReactElement} Courbe et interactions de survol.
 */
export function AverageSessionsChart({ sessions }) {
  return (
    <article className="chart-card chart-card--sessions">
      <h2>Durée moyenne des sessions</h2>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={sessions} margin={{ top: 50, right: 12, bottom: 12, left: 12 }}>
          {/* Affiche tous les jours de la semaine sur l'axe horizontal. */}
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.72)', fontSize: 12 }}
            interval={0}
          />
          {/* Les durées déterminent la hauteur des points ; les graduations sont masquées. */}
          <YAxis hide domain={['dataMin - 10', 'dataMax + 20']} />
          <Tooltip content={<SessionsTooltip />} cursor={<SessionsCursor />} />
          {/* Trace les durées reçues avec une courbe lissée et un point actif au survol. */}
          <Line
            type="natural"
            dataKey="sessionLength"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#ffffff', stroke: 'rgba(255, 255, 255, 0.25)', strokeWidth: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </article>
  )
}

// Vérifie les types des jours et durées reçus par le graphique en développement.
AverageSessionsChart.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      sessionLength: PropTypes.number.isRequired,
    }).isRequired,
  ).isRequired,
}
