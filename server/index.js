import express from 'express'
import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = process.env.DATA_DIR || join(__dirname, 'data')
mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(join(DATA_DIR, 'game.db'))

// ── Schema ────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT    NOT NULL UNIQUE,
    pin  TEXT
  );

  CREATE TABLE IF NOT EXISTS user_state (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    data    TEXT NOT NULL
  );
`)

// ── Migration: move old single-player game_state → Jugador 1 ─────────────
try {
  const oldTable = db.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='game_state'"
  ).get()

  if (oldTable) {
    const { n } = db.prepare('SELECT COUNT(*) as n FROM users').get()
    if (n === 0) {
      const oldRow = db.prepare('SELECT data FROM game_state WHERE id = 1').get()
      if (oldRow) {
        const { lastInsertRowid } = db.prepare(
          'INSERT INTO users (name) VALUES (?)'
        ).run('Jugador 1')
        db.prepare(
          'INSERT INTO user_state (user_id, data) VALUES (?, ?)'
        ).run(lastInsertRowid, oldRow.data)
        console.log('Migrated existing progress to "Jugador 1"')
      }
    }
  }
} catch (e) {
  console.error('Migration error:', e.message)
}

// ── App ───────────────────────────────────────────────────────────────────
const app = express()
app.use(express.json())

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }))

// ── Users ─────────────────────────────────────────────────────────────────

const DEFAULT_EQUIPPED = {
  horn: null, wings: null, cape: null,
  bodyColor: 'white', maneColor: 'lavender',
}

app.get('/api/users', (_req, res) => {
  const users = db.prepare('SELECT id, name, pin FROM users ORDER BY id').all()

  const result = users.map(u => {
    const row = db.prepare('SELECT data FROM user_state WHERE user_id = ?').get(u.id)
    let totalStars = 0
    let equipped = { ...DEFAULT_EQUIPPED }
    if (row) {
      try {
        const state = JSON.parse(row.data)
        totalStars = Object.values(state.tables ?? {})
          .reduce((sum, t) => sum + (t.stars ?? 0), 0)
        equipped = state.unicorn?.equipped ?? equipped
      } catch { /* ignore corrupt state */ }
    }
    return { id: u.id, name: u.name, hasPin: !!u.pin, totalStars, equipped }
  })

  res.json(result)
})

app.post('/api/users', (req, res) => {
  const { name, pin } = req.body ?? {}
  if (!name?.trim()) return res.status(400).json({ error: 'name required' })

  const existing = db.prepare('SELECT id FROM users WHERE name = ?').get(name.trim())
  if (existing) return res.status(409).json({ error: 'name taken' })

  const { lastInsertRowid } = db.prepare(
    'INSERT INTO users (name, pin) VALUES (?, ?)'
  ).run(name.trim(), pin || null)

  res.json({ id: Number(lastInsertRowid), name: name.trim() })
})

app.post('/api/users/:id/login', (req, res) => {
  const user = db.prepare('SELECT id, name, pin FROM users WHERE id = ?').get(req.params.id)
  if (!user) return res.status(404).json({ ok: false, error: 'not found' })

  if (user.pin && user.pin !== String(req.body?.pin ?? '')) {
    return res.json({ ok: false, error: 'wrong pin' })
  }

  res.json({ ok: true, id: user.id, name: user.name })
})

app.delete('/api/users/:id', (req, res) => {
  db.prepare('DELETE FROM user_state WHERE user_id = ?').run(req.params.id)
  db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// ── Game state ────────────────────────────────────────────────────────────

app.get('/api/state/:userId', (req, res) => {
  const row = db.prepare('SELECT data FROM user_state WHERE user_id = ?').get(req.params.userId)
  res.json(row ? JSON.parse(row.data) : null)
})

app.put('/api/state/:userId', (req, res) => {
  db.prepare(
    'INSERT OR REPLACE INTO user_state (user_id, data) VALUES (?, ?)'
  ).run(req.params.userId, JSON.stringify(req.body))
  res.json({ ok: true })
})

// ── Start ─────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`API listening on :${PORT}`))
