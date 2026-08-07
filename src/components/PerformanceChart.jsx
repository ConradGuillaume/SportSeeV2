import React from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

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
