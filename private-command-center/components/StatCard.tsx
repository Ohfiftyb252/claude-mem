'use client'

type Accent = 'blue' | 'amber' | 'emerald' | 'rose' | 'violet'

interface Props {
  label: string
  value: number
  accent: Accent
  onClick?: () => void
}

const styles: Record<Accent, { card: string; value: string }> = {
  blue:    { card: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',    value: 'text-blue-400' },
  amber:   { card: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40', value: 'text-amber-400' },
  emerald: { card: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40', value: 'text-emerald-400' },
  rose:    { card: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40',    value: 'text-rose-400' },
  violet:  { card: 'bg-violet-500/10 border-violet-500/20 hover:border-violet-500/40', value: 'text-violet-400' },
}

export default function StatCard({ label, value, accent, onClick }: Props) {
  const s = styles[accent]
  return (
    <button
      onClick={onClick}
      className={`${s.card} border rounded-xl p-5 text-left w-full transition-all duration-150 cursor-pointer`}
    >
      <p className="text-zinc-400 text-sm font-medium">{label}</p>
      <p className={`text-4xl font-bold mt-1 tabular-nums ${s.value}`}>{value}</p>
    </button>
  )
}
