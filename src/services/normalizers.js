const kindLabels = {
  cardio: 'Cardio',
  energy: 'Énergie',
  endurance: 'Endurance',
  strength: 'Force',
  speed: 'Vitesse',
  intensity: 'Intensité',
}

const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function normalizeMainUser(rawUser) {
  const rawScore = rawUser.todayScore ?? rawUser.score ?? 0
  const score = Math.min(Math.max(Number(rawScore) || 0, 0), 1)

  return {
    id: rawUser.id,
    firstName: rawUser.userInfos.firstName,
    score,
    keyData: [
      {
        type: 'calories',
        label: 'Calories',
        value: rawUser.keyData.calorieCount,
        unit: 'kCal',
        tone: 'red',
      },
      {
        type: 'proteins',
        label: 'Protéines',
        value: rawUser.keyData.proteinCount,
        unit: 'g',
        tone: 'blue',
      },
      {
        type: 'carbs',
        label: 'Glucides',
        value: rawUser.keyData.carbohydrateCount,
        unit: 'g',
        tone: 'yellow',
      },
      {
        type: 'lipids',
        label: 'Lipides',
        value: rawUser.keyData.lipidCount,
        unit: 'g',
        tone: 'pink',
      },
    ],
  }
}

export function normalizeActivity(rawActivity) {
  return rawActivity.sessions.map((session, index) => ({
    day: String(index + 1),
    kilogram: session.kilogram,
    calories: session.calories,
  }))
}

export function normalizeAverageSessions(rawSessions) {
  return rawSessions.sessions.map((session) => ({
    day: dayLabels[session.day - 1],
    sessionLength: session.sessionLength,
  }))
}

export function normalizePerformance(rawPerformance) {
  return rawPerformance.data
    .map((entry) => ({
      value: entry.value,
      kind: kindLabels[rawPerformance.kind[entry.kind]] ?? rawPerformance.kind[entry.kind],
    }))
    .reverse()
}
