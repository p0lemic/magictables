import { useState } from 'react'
import type { Screen } from '../types'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

const TABLE_COLORS: Record<number, string> = {
  1:  'bg-purple-100  border-purple-300  text-purple-700',
  2:  'bg-pink-100    border-pink-300    text-pink-700',
  3:  'bg-amber-100   border-amber-300   text-amber-700',
  4:  'bg-teal-100    border-teal-300    text-teal-700',
  5:  'bg-blue-100    border-blue-300    text-blue-700',
  6:  'bg-rose-100    border-rose-300    text-rose-700',
  7:  'bg-green-100   border-green-300   text-green-700',
  8:  'bg-orange-100  border-orange-300  text-orange-700',
  9:  'bg-indigo-100  border-indigo-300  text-indigo-700',
  10: 'bg-fuchsia-100 border-fuchsia-300 text-fuchsia-700',
}

const ROW_COLORS: Record<number, string> = {
  1:  'bg-purple-50  border-purple-200',
  2:  'bg-pink-50    border-pink-200',
  3:  'bg-amber-50   border-amber-200',
  4:  'bg-teal-50    border-teal-200',
  5:  'bg-blue-50    border-blue-200',
  6:  'bg-rose-50    border-rose-200',
  7:  'bg-green-50   border-green-200',
  8:  'bg-orange-50  border-orange-200',
  9:  'bg-indigo-50  border-indigo-200',
  10: 'bg-fuchsia-50 border-fuchsia-200',
}

export default function TableReference({ onNavigate }: Props) {
  const [selected, setSelected] = useState<number>(1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-5 p-6 font-nunito relative overflow-hidden">
      <StarParticles />

      {/* Header */}
      <div className="relative z-10 w-full max-w-md flex items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="w-12 h-12 bg-white rounded-xl border-2 border-b-4 border-magic-purple
            text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center shrink-0"
        >
          ←
        </button>
        <h2 className="text-3xl font-black text-magic-purple">Ver tablas</h2>
      </div>

      {/* Table selector */}
      <div className="relative z-10 w-full max-w-md">
        <p className="text-sm font-bold text-magic-purple/70 mb-2 text-center">Elige una tabla</p>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setSelected(n)}
              className={`
                h-12 rounded-xl border-2 border-b-4 text-xl font-black transition-all active:scale-95
                ${selected === n
                  ? 'bg-magic-purple text-white border-purple-800 scale-105 shadow-lg'
                  : 'bg-white text-magic-purple border-magic-purple shadow-sm'}
              `}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Table display */}
      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className={`rounded-2xl border-2 p-3 mb-3 text-center ${TABLE_COLORS[selected]}`}>
          <span className="text-2xl font-black">Tabla del {selected}</span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(multiplier => (
            <div
              key={multiplier}
              className={`flex items-center rounded-xl border-2 px-4 py-3 ${ROW_COLORS[selected]}`}
            >
              <span className="text-2xl font-black text-gray-700 w-8 text-center">{selected}</span>
              <span className="text-2xl font-bold text-gray-400 mx-3">×</span>
              <span className="text-2xl font-black text-gray-700 w-8 text-center">{multiplier}</span>
              <span className="text-2xl font-bold text-gray-400 mx-3">=</span>
              <span className="text-3xl font-black text-magic-purple ml-auto">{selected * multiplier}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Practice button */}
      <div className="relative z-10 w-full max-w-md pb-4">
        <button
          onClick={() => onNavigate({ name: 'practice-session', table: selected, mode: 'free' })}
          className="w-full h-16 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🎯 ¡Practicar la tabla del {selected}!
        </button>
      </div>
    </div>
  )
}
