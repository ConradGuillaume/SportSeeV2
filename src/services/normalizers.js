// Associe les catégories anglaises de l'API aux libellés français du radar.
const kindLabels = {
  cardio: "Cardio",
  energy: "Énergie",
  endurance: "Endurance",
  strength: "Force",
  speed: "Vitesse",
  intensity: "Intensité",
};

// Initiales affichées sur le LineChart, dans l'ordre du lundi au dimanche.
const dayLabels = ["L", "M", "M", "J", "V", "S", "D"];

/**
 * Prépare les informations générales pour que les composants utilisent le même format.
 * L'API nomme le score todayScore pour Karl et score pour Cecilia : on garde un seul nom.
 * Le prénom devient directement accessible pour le message Bonjour.
 * Les chiffres clés deviennent un tableau pour afficher les quatre cartes avec map.
 * Le backend doit fournir todayScore ou score, un nombre entre 0 et 1.
 * @param {{id: number, userInfos: {firstName: string}, todayScore?: number, score?: number, keyData: {calorieCount: number, proteinCount: number, carbohydrateCount: number, lipidCount: number}}} rawUser
 * @returns {{id: number, firstName: string, score: number, keyData: Array<{type: string, label: string, value: number, unit: string, tone: string}>}}
 */
export function normalizeMainUser(rawUser) {
  // Unifie les deux noms utilisés par l'API pour le score.
  const score = rawUser.todayScore ?? rawUser.score;
  // Retourne au service les informations préparées pour le dashboard.
  return {
    id: rawUser.id,
    firstName: rawUser.userInfos.firstName,
    score,
    keyData: [
      {
        type: "calories",
        label: "Calories",
        value: rawUser.keyData.calorieCount,
        unit: "kCal",
        tone: "red",
      },
      {
        type: "proteins",
        label: "Protéines",
        value: rawUser.keyData.proteinCount,
        unit: "g",
        tone: "blue",
      },
      {
        type: "carbs",
        label: "Glucides",
        value: rawUser.keyData.carbohydrateCount,
        unit: "g",
        tone: "yellow",
      },
      {
        type: "lipids",
        label: "Lipides",
        value: rawUser.keyData.lipidCount,
        unit: "g",
        tone: "pink",
      },
    ],
  };
}

/**
 * Prépare les journées pour l'axe horizontal du BarChart d'activité quotidienne.
 * L'API fournit une date complète, mais le graphique doit afficher le jour du mois.
 * Exemple : "2020-07-01" devient "1". Le poids et les calories restent inchangés.
 * La lecture en UTC évite qu'un fuseau horaire local décale le jour affiché.
 * @param {{sessions: Array<{day: string, kilogram: number, calories: number}>}} rawActivity Dates ISO YYYY-MM-DD.
 * @returns {Array<{day: string, kilogram: number, calories: number}>} Journées prêtes pour le BarChart.
 */
export function normalizeActivity(rawActivity) {
  // Crée un nouveau tableau : jour du mois en UTC, poids et calories inchangés.
  return rawActivity.sessions.map((session) => ({
    day: String(new Date(session.day).getUTCDate()),
    kilogram: session.kilogram,
    calories: session.calories,
  }));
}

/**
 * Prépare les jours pour que l'utilisateur repère les durées sur le LineChart.
 * Dans les données fournies, 1 représente lundi, 2 mardi, jusqu'à 7 pour dimanche.
 * Le graphique affiche leurs initiales L, M, M, J, V, S, D plutôt que ces numéros.
 * On conserve les durées de l'API : cette fonction ne calcule pas de moyenne.
 * @param {{sessions: Array<{day: number, sessionLength: number}>}} rawSessions Jours numérotés et durées en minutes.
 * @returns {Array<{day: string, sessionLength: number}>} Jours libellés et durées prêts pour le LineChart.
 * @example
 * normalizeAverageSessions({ sessions: [{ day: 1, sessionLength: 30 }] })
 * // Retourne [{ day: 'L', sessionLength: 30 }] : 30 minutes pour lundi.
 */
export function normalizeAverageSessions(rawSessions) {
  // Pour lundi : day vaut 1, donc dayLabels[1 - 1] lit la première lettre, "L".
  return rawSessions.sessions.map((session) => ({
    day: dayLabels[session.day - 1],
    sessionLength: session.sessionLength,
  }));
}

/**
 * Prépare des catégories lisibles en français autour du graphique radar.
 * L'API associe chaque valeur à un numéro : son dictionnaire kind donne le nom anglais.
 * On retrouve ce nom puis sa traduction, par exemple 4 -> strength -> Force.
 * On inverse l'ordre pour placer les catégories dans l'ordre choisi pour le graphique.
 * Les valeurs restent inchangées ; sans traduction, le nom anglais est conservé.
 * @param {{kind: Object<number, string>, data: Array<{value: number, kind: number}>}} rawPerformance
 * @returns {Array<{value: number, kind: string}>} Valeurs et libellés prêts pour le radar.
 */
export function normalizePerformance(rawPerformance) {
  // Retrouve chaque catégorie par son identifiant, puis traduit son libellé.
  return (
    rawPerformance.data
      .map((entry) => ({
        value: entry.value,
        kind:
          kindLabels[rawPerformance.kind[entry.kind]] ??
          rawPerformance.kind[entry.kind],
      }))
      // Inverse le nouveau tableau pour l'affichage, sans modifier les données brutes.
      .reverse()
  );
}
