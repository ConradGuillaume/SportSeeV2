import React from 'react'
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from 'recharts'

export function ScoreChart({ score }) {
  const percentage = Math.round(score * 100)
  const data = [{ name: 'score', value: percentage, fill: '#ff0000' }]

  return (
    <article className="chart-card chart-card--score">
      <h2>Score</h2>
      <ResponsiveContainer width="100%" height={230}>
        <RadialBarChart
          data={data}
          innerRadius="72%"
          outerRadius="82%"
          startAngle={90}
          endAngle={450}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            data={data}
            dataKey="value"
            cornerRadius={10}
            background={{ fill: '#ffffff' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="score-label" aria-label={`Score de ${percentage} pour cent`}>
        <strong>{percentage}%</strong>
        <span>de votre objectif</span>
      </div>
    </article>
  )
}
