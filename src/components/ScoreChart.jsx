import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export function ScoreChart({ score }) {
  const percentage = Math.round(score * 100)
  const data = [
    { name: 'score', value: percentage },
    { name: 'remaining', value: 100 - percentage },
  ]

  return (
    <article className="chart-card chart-card--score">
      <h2>Score</h2>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={90}
            endAngle={450}
            innerRadius={72}
            outerRadius={82}
            cornerRadius={10}
            paddingAngle={0}
          >
            <Cell fill="#ff0000" />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="score-label" aria-label={`Score de ${percentage} pour cent`}>
        <strong>{percentage}%</strong>
        <span>de votre objectif</span>
      </div>
    </article>
  )
}
