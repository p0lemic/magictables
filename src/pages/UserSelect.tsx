import { useState, useEffect } from 'react'
import type { User } from '../types'
import UnicornAvatar from '../components/UnicornAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  onLogin: (userId: number) => void
}

// ── Inline PIN pad ────────────────────────────────────────────────────────

interface PinPadProps {
  onComplete: (pin: string) => void
  error: boolean
}

function PinPad({ onComplete, error }: PinPadProps) {
  const [digits, setDigits] = useState('')

  useEffect(() => {
    if (error) setDigits('')
  }, [error])

  function press(d: string) {
    if (digits.length >= 4) return
    const next = digits + d
    setDigits(next)
    if (next.length === 4) onComplete(next)
  }

  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3']

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Dot indicators */}
      <div className="flex gap-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full border-2 transition-all duration-150
              ${i < digits.length
                ? 'bg-magic-purple border-magic-purple'
                : 'bg-white border-magic-purple/40'
              } ${error ? 'border-red-500 bg-red-400' : ''}`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm font-bold text-red-500">PIN incorrecto</p>
      )}

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => press(k)}
            className="w-16 h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple
              text-2xl font-black text-magic-purple active:scale-95 active:border-b-2 transition-all shadow-sm"
          >
            {k}
          </button>
        ))}
        <button
          onClick={() => setDigits(d => d.slice(0, -1))}
          className="w-16 h-16 bg-gray-100 rounded-xl border-2 border-b-4 border-gray-400
            text-2xl active:scale-95 active:border-b-2 transition-all shadow-sm"
        >
          ⌫
        </button>
        <button
          onClick={() => press('0')}
          className="w-16 h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple
            text-2xl font-black text-magic-purple active:scale-95 active:border-b-2 transition-all shadow-sm"
        >
          0
        </button>
        <div /> {/* empty cell */}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

type Modal =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'pin'; userId: number; name: string }
  | { type: 'pin-delete'; userId: number; name: string }
  | { type: 'confirm-delete'; userId: number; name: string }

export default function UserSelect({ onLogin }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const [pinError, setPinError] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)

  // Create-form state
  const [newName, setNewName] = useState('')
  const [usePin, setUsePin] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function deleteUser(userId: number) {
    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    if (!res.ok) return  // don't update UI if server failed
    setUsers(prev => prev.filter(u => u.id !== userId))
    setModal({ type: 'none' })
  }

  async function selectUser(user: User) {
    if (user.hasPin) {
      setPinError(false)
      setModal({ type: 'pin', userId: user.id, name: user.name })
    } else {
      await loginAs(user.id)
    }
  }

  async function loginAs(userId: number) {
    setLoggingIn(true)
    onLogin(userId)
  }

  async function handlePin(pin: string) {
    if (modal.type !== 'pin' && modal.type !== 'pin-delete') return
    const { userId } = modal
    const res = await fetch(`/api/users/${userId}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await res.json()
    if (data.ok) {
      if (modal.type === 'pin') {
        await loginAs(userId)
      } else {
        setModal({ type: 'confirm-delete', userId: modal.userId, name: modal.name })
      }
    } else {
      setPinError(true)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    const name = newName.trim()
    if (!name) return
    if (usePin && newPin.length !== 4) {
      setCreateError('El PIN debe tener 4 dígitos')
      return
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, pin: usePin ? newPin : undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setCreateError(data.error === 'name taken' ? 'Ese nombre ya existe' : 'Error al crear')
        return
      }
      await loginAs(data.id)
    } catch {
      setCreateError('No se puede conectar con el servidor')
    }
  }

  function openCreate() {
    setNewName('')
    setUsePin(false)
    setNewPin('')
    setCreateError('')
    setModal({ type: 'create' })
  }

  if (loggingIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex items-center justify-center font-nunito">
        <p className="text-2xl font-black text-magic-purple animate-pulse">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-6 p-6 font-nunito relative overflow-hidden">
      <StarParticles />

      {/* Title */}
      <div className="relative z-10 text-center pt-6">
        <h1 className="text-4xl font-black text-magic-purple">¿Quién juega?</h1>
        <p className="text-lg font-bold text-pink-500 mt-1">🦄 Elige tu jugador</p>
      </div>

      {/* User grid */}
      <div className="relative z-10 w-full max-w-md">
        {loading ? (
          <p className="text-center text-magic-purple font-bold animate-pulse">Cargando...</p>
        ) : users.length === 0 ? (
          <p className="text-center text-magic-purple/60 font-bold py-8">
            Aún no hay jugadores. ¡Crea el primero!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {users.map(user => (
              <div key={user.id} className="relative">
                <button
                  onClick={() => selectUser(user)}
                  className="w-full bg-white rounded-2xl border-2 border-b-4 border-magic-purple p-4
                    flex flex-col items-center gap-2 shadow-md
                    active:scale-95 active:border-b-2 transition-all"
                >
                  <UnicornAvatar equipped={user.equipped} size={70} />
                  <span className="font-black text-magic-purple text-base leading-tight text-center">
                    {user.name}
                  </span>
                  <span className="text-sm font-bold text-amber-500">
                    ⭐ {user.totalStars}/30
                  </span>
                  {user.hasPin && (
                    <span className="text-xs text-gray-400 font-bold">🔒 PIN</span>
                  )}
                </button>
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); setPinError(false); setModal(user.hasPin ? { type: 'pin-delete', userId: user.id, name: user.name } : { type: 'confirm-delete', userId: user.id, name: user.name }) }}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-100 hover:bg-red-200
                    rounded-full text-red-500 text-sm font-black flex items-center justify-center
                    transition-colors active:scale-90"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New user button */}
      <button
        onClick={openCreate}
        className="relative z-10 w-full max-w-md h-16 bg-white text-magic-purple rounded-2xl
          border-2 border-b-4 border-magic-purple text-xl font-black shadow
          active:scale-95 active:border-b-2 transition-all"
      >
        ＋ Nuevo jugador
      </button>

      {/* ── PIN modal ──────────────────────────────────────────────────── */}
      {modal.type === 'pin' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-2xl border-2 border-magic-purple">
            <p className="text-xl font-black text-magic-purple">
              Hola, {modal.name} 👋
            </p>
            <p className="text-sm font-bold text-gray-500">Introduce tu PIN</p>
            <PinPad onComplete={handlePin} error={pinError} />
            <button
              onClick={() => setModal({ type: 'none' })}
              className="mt-2 text-sm font-bold text-gray-400 active:text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── PIN modal (delete) ────────────────────────────────────────── */}
      {modal.type === 'pin-delete' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-2xl border-2 border-red-300">
            <p className="text-xl font-black text-gray-700 text-center">
              Borrar a {modal.name}
            </p>
            <p className="text-sm text-gray-500 text-center">
              Introduce el PIN para confirmar
            </p>
            <PinPad onComplete={handlePin} error={pinError} />
            <button
              onClick={() => setModal({ type: 'none' })}
              className="text-sm font-bold text-gray-400 active:text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Confirm delete modal ──────────────────────────────────────── */}
      {modal.type === 'confirm-delete' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs flex flex-col items-center gap-4 shadow-2xl border-2 border-red-300">
            <p className="text-xl font-black text-gray-700 text-center">
              ¿Borrar a {modal.name}?
            </p>
            <p className="text-sm text-gray-500 text-center">
              Se borrará todo su progreso y no se puede deshacer.
            </p>
            <button
              onClick={() => deleteUser(modal.userId)}
              className="w-full h-12 bg-red-500 text-white rounded-2xl border-b-4 border-red-700
                font-black text-lg active:scale-95 active:border-b-2 transition-all"
            >
              Sí, borrar
            </button>
            <button
              onClick={() => setModal({ type: 'none' })}
              className="text-sm font-bold text-gray-400 active:text-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Create modal ───────────────────────────────────────────────── */}
      {modal.type === 'create' && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs flex flex-col gap-4 shadow-2xl border-2 border-magic-purple">
            <p className="text-xl font-black text-magic-purple text-center">
              Nuevo jugador 🦄
            </p>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Tu nombre"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                maxLength={20}
                autoFocus
                className="w-full h-12 px-4 rounded-xl border-2 border-magic-purple/40
                  text-lg font-bold text-gray-700 focus:outline-none focus:border-magic-purple"
              />

              {/* PIN toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePin}
                  onChange={e => setUsePin(e.target.checked)}
                  className="w-5 h-5 accent-purple-500"
                />
                <span className="font-bold text-gray-600">Añadir PIN (opcional)</span>
              </label>

              {usePin && (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="PIN de 4 dígitos"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                  className="w-full h-12 px-4 rounded-xl border-2 border-magic-purple/40
                    text-lg font-bold text-gray-700 tracking-widest text-center
                    focus:outline-none focus:border-magic-purple"
                />
              )}

              {createError && (
                <p className="text-sm font-bold text-red-500 text-center">{createError}</p>
              )}

              <button
                type="submit"
                className="h-14 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
                  text-lg font-black active:scale-95 active:border-b-2 transition-all shadow"
              >
                ¡Jugar!
              </button>

              <button
                type="button"
                onClick={() => setModal({ type: 'none' })}
                className="text-sm font-bold text-gray-400 active:text-gray-600"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
