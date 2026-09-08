import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { once } from 'node:events'
import { createServer } from 'vite'
import { normalizeActivity } from '../src/services/normalizers.js'

const require = createRequire(new URL('../backend/package.json', import.meta.url))
const express = require('express')
const app = express()
app.use(require('../backend/app/routes.js'))
const api = app.listen(0, '127.0.0.1')
await once(api, 'listening')
const baseUrl = `http://127.0.0.1:${api.address().port}`

try {
  assert.deepEqual(normalizeActivity({ sessions: [
    { day: '2020-07-15', kilogram: 80, calories: 240 },
    { day: '2020-08-02', kilogram: 79, calories: 200 },
  ] }).map(({ day }) => day), ['15', '2'])
  console.log('PASS: activity labels use calendar dates')

  for (const source of ['mock', 'api']) {
    const vite = await createServer({
      configFile: false,
      server: { middlewareMode: true },
      define: {
        'import.meta.env.VITE_DATA_SOURCE': JSON.stringify(source),
        'import.meta.env.VITE_API_BASE_URL': JSON.stringify(baseUrl),
      },
    })
    try {
      const { getUserProfile } = await vite.ssrLoadModule('/src/services/userService.js')
      for (const [id, name, score] of [[12, 'Karl', 0.12], [18, 'Cecilia', 0.3]]) {
        const profile = await getUserProfile(id)
        assert.equal(profile.id, id)
        assert.equal(profile.firstName, name)
        assert.equal(profile.score, score)
        assert.equal(profile.activity.length, 7)
        assert.equal(profile.averageSessions.length, 7)
        assert.equal(profile.performance.length, 6)
        assert.equal(profile.keyData.length, 4)
        assert.ok(profile.keyData.every(({ value }) => Number.isFinite(value)))
        console.log(`PASS: ${source} profile ${id}, name, score and four datasets`)
      }
      await assert.rejects(getUserProfile(999))
      console.log(`PASS: ${source} unknown user rejected`)
      if (source === 'api') {
        await new Promise((resolve, reject) => api.close((error) => error ? reject(error) : resolve()))
        await assert.rejects(getUserProfile(12))
        console.log('PASS: unavailable API rejected for the React error handler')
      }
    } finally {
      await vite.close()
    }
  }
} finally {
  if (api.listening) await new Promise((resolve) => api.close(resolve))
}
