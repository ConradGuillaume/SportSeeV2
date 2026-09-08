const kindLabels = {
  cardio: 'Cardio',
  energy: 'Énergie',
  endurance: 'Endurance',
  strength: 'Force',
  speed: 'Vitesse',
  intensity: 'Intensité',
}

const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

/**
 * Unifie todayScore/score en une proportion entre 0 et 1 et prepare les cartes.
 * todayScore est prioritaire ; un score absent ou non numerique devient 0.
 * @param {{id: number, userInfos: {firstName: string}, todayScore?: number, score?: number, keyData: {calorieCount: number, proteinCount: number, carbohydrateCount: number, lipidCount: number}}} rawUser
 * @returns {{id: number, firstName: string, score: number, keyData: Array<{type: string, label: string, value: number, unit: string, tone: string}>}}
 */
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

/**
 * Extrait le jour du mois en UTC pour eviter un decalage selon le fuseau local.
 * @param {{sessions: Array<{day: string, kilogram: number, calories: number}>}} rawActivity Dates ISO YYYY-MM-DD.
 * @returns {Array<{day: string, kilogram: number, calories: number}>}
 */
export function normalizeActivity(rawActivity) {
  return rawActivity.sessions.map((session) => ({
    day: String(new Date(session.day).getUTCDate()),
    kilogram: session.kilogram,
    calories: session.calories,
  }))
}

/**
 * Convertit les jours 1 (lundi) a 7 (dimanche) en libelles du graphique.
 * @param {{sessions: Array<{day: number, sessionLength: number}>}} rawSessions Durees en minutes.
 * @returns {Array<{day: string, sessionLength: number}>}
 */
export function normalizeAverageSessions(rawSessions) {
  return rawSessions.sessions.map((session) => ({
    day: dayLabels[session.day - 1],
    sessionLength: session.sessionLength,
  }))
}

/**
 * Traduit les categories et inverse leur ordre pour le radar.
 * Une categorie inconnue conserve son libelle fourni par l'API.
 * @param {{kind: Object<number, string>, data: Array<{value: number, kind: number}>}} rawPerformance
 * @returns {Array<{value: number, kind: string}>}
 */
export function normalizePerformance(rawPerformance) {
  return rawPerformance.data
    .map((entry) => ({
      value: entry.value,
      kind: kindLabels[rawPerformance.kind[entry.kind]] ?? rawPerformance.kind[entry.kind],
    }))
    .reverse()
}
