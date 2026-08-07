import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function ActivityTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  return (
    <div className="activity-tooltip">
      <span>{payload[0].value}kg</span>
      <span>{payload[1].value}Kcal</span>
    </div>
  )
}

export function ActivityChart({ sessions }) {
  return (
    <article className="chart-card chart-card--activity">
      <div className="chart-heading">
        <h2>Activité quotidienne</h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={sessions} barGap={8} margin={{ top: 30, right: 10, bottom: 10, left: 20 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={16} />
          <YAxis
            yAxisId="kilogram"
            orientation="right"
            domain={['dataMin - 1', 'dataMax + 1']}
            tickLine={false}
            axisLine={false}
            tickMargin={20}
          />
          <YAxis yAxisId="calories" orientation="left" hide />
          <Tooltip content={<ActivityTooltip />} cursor={{ fill: 'rgba(196, 196, 196, 0.45)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ top: 0, right: 0 }}
          />
          <Bar
            yAxisId="kilogram"
            name="Poids (kg)"
            dataKey="kilogram"
            fill="#282d30"
            radius={[4, 4, 0, 0]}
            barSize={7}
          />
          <Bar
            yAxisId="calories"
            name="Calories brûlées (kCal)"
            dataKey="calories"
            fill="#e60000"
            radius={[4, 4, 0, 0]}
            barSize={7}
          />
        </BarChart>
      </ResponsiveContainer>
    </article>
  )
}
