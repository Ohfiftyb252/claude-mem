import dynamic from 'next/dynamic'

const CommandCenter = dynamic(() => import('@/components/CommandCenter'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-zinc-600 text-sm tracking-widest uppercase">Loading</div>
    </div>
  ),
})

export default function Home() {
  return <CommandCenter />
}
