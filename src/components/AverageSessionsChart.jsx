import React from 'react'
import {
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function SessionsTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return <div className="sessions-tooltip">{payload[0].value} min</div>
}

function SessionsCursor({ points, width, height }) {
  const x = points?.[0]?.x ?? 0
  return <Rectangle fill="rgba(0, 0, 0, 0.12)" x={x} y={0} width={width - x} height={height} />
}

export function AverageSessionsChart({ sessions }) {
  return (
    <article className="chart-card chart-card--sessions">
      <h2>Durée moyenne des sessions</h2>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={sessions} margin={{ top: 50, right: 12, bottom: 12, left: 12 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.72)', fontSize: 12 }}
            interval={0}
          />
          <YAxis hide domain={['dataMin - 10', 'dataMax + 20']} />
          <Tooltip content={<SessionsTooltip />} cursor={<SessionsCursor />} />
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
