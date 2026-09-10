import assert from 'node:assert/strict'
import PropTypes from 'prop-types'

/** Charge les composants via Vite afin de contrôler leurs contrats JSX réels. */
export async function loadPropChecks(vite) {
  const names = [
    'ActivityChart', 'AverageSessionsChart', 'PerformanceChart',
    'ScoreChart', 'KeyDataCard', 'ProfileSelection',
  ]
  const components = Object.fromEntries(await Promise.all(names.map(async (name) => {
    const module = await vite.ssrLoadModule(`/src/components/${name}.jsx`)
    assert.ok(module[name].propTypes, `${name} must declare PropTypes`)
    return [name, module[name]]
  })))

  function warningsFor(name, props) {
    const warnings = []
    const originalError = console.error
    try {
      console.error = (...args) => warnings.push(args.join(' '))
      PropTypes.resetWarningCache()
      PropTypes.checkPropTypes(components[name].propTypes, props, 'prop', name)
    } finally {
      console.error = originalError
    }
    return warnings
  }

  return {
    assertProfileProps(profile) {
      const cases = [
        ['ActivityChart', { sessions: profile.activity }],
        ['AverageSessionsChart', { sessions: profile.averageSessions }],
        ['PerformanceChart', { data: profile.performance }],
        ['ScoreChart', { score: profile.score }],
        ['ProfileSelection', { onSelect: () => {} }],
        ...profile.keyData.map((item) => ['KeyDataCard', { item }]),
      ]
      for (const [name, props] of cases) {
        assert.deepEqual(warningsFor(name, props), [], `${name}: normalized profile ${profile.id}`)
      }
    },
    assertInvalidPropsRejected() {
      // Chaque prop principale est requise.
      for (const name of names) {
        assert.ok(warningsFor(name, {}).length > 0, `${name}: missing props must warn`)
      }
      // Contrôle des champs imbriqués, pas seulement du type tableau/objet.
      const invalidCases = [
        ['ActivityChart', { sessions: [{ day: '1', kilogram: '80', calories: 240 }] }],
        ['ActivityChart', { sessions: [null] }],
        ['AverageSessionsChart', { sessions: [{ day: 'L', sessionLength: '30' }] }],
        ['PerformanceChart', { data: [{ kind: 1, value: 80 }] }],
        ['ScoreChart', { score: '12%' }],
        ['ProfileSelection', { onSelect: 12 }],
        ['KeyDataCard', { item: { type: 'unknown', label: 'Calories', value: 10, unit: 'kCal' } }],
        ['KeyDataCard', { item: { type: 'calories', label: 'Calories', value: 10, unit: 'kg' } }],
        ['KeyDataCard', { item: { type: 'calories', label: 'Calories', value: '10', unit: 'kCal' } }],
      ]
      for (const [name, props] of invalidCases) {
        assert.ok(warningsFor(name, props).length > 0, `${name}: invalid props must warn`)
      }
      assert.deepEqual(warningsFor('ScoreChart', { score: 0 }), [], 'zero is a valid score')
    },
  }
}
