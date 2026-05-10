'use client'
import { LayoutDashboard, Link2, CheckSquare, FileText, Users } from 'lucide-react'
import type { Tab } from '@/lib/types'

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Home',  icon: LayoutDashboard },
  { id: 'links',     label: 'Links', icon: Link2 },
  { id: 'tasks',     label: 'Tasks', icon: CheckSquare },
  { id: 'notes',     label: 'Notes', icon: FileText },
  { id: 'leads',     label: 'Leads', icon: Users },
]

export default function MobileNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-20">
      <div className="flex">
        {tabs.map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                active ? 'text-white' : 'text-zinc-500'
              }`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
