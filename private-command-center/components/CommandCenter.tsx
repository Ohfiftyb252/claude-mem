'use client'
import { useState } from 'react'
import { LayoutDashboard, Link2, CheckSquare, FileText, Users } from 'lucide-react'
import { useLinks, useTasks, useNotes, useLeads } from '@/lib/storage'
import type { Tab } from '@/lib/types'
import StatCard from './StatCard'
import MobileNav from './MobileNav'
import QuickCapture from './QuickCapture'
import LinksPanel from './LinksPanel'
import TasksPanel from './TasksPanel'
import NotesPanel from './NotesPanel'
import LeadsPanel from './LeadsPanel'

const navTabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'links',     label: 'Links',     icon: Link2 },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  { id: 'notes',     label: 'Notes',     icon: FileText },
  { id: 'leads',     label: 'Leads',     icon: Users },
]

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const linksHook  = useLinks()
  const tasksHook  = useTasks()
  const notesHook  = useNotes()
  const leadsHook  = useLeads()

  const openTasks = tasksHook.tasks.filter(t => t.status === 'open').length

  const goTo = (tab: Tab) => setActiveTab(tab)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">⬡</span>
            <span className="font-semibold text-white tracking-tight text-sm">Command Center</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navTabs.map(tab => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => goTo(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/60'
                  }`}
                >
                  <tab.icon size={15} strokeWidth={active ? 2.5 : 1.5} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-28 md:pb-10">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Good {getGreeting()}</h1>
              <p className="text-zinc-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Links"      value={linksHook.links.length} accent="violet" onClick={() => goTo('links')} />
              <StatCard label="Open Tasks" value={openTasks}               accent="amber"  onClick={() => goTo('tasks')} />
              <StatCard label="Notes"      value={notesHook.notes.length}  accent="emerald" onClick={() => goTo('notes')} />
              <StatCard label="Leads"      value={leadsHook.leads.length}  accent="rose"   onClick={() => goTo('leads')} />
            </div>

            <QuickCapture
              onAddLink={data  => { linksHook.addLink(data);  goTo('links') }}
              onAddTask={data  => { tasksHook.addTask(data);  goTo('tasks') }}
              onAddNote={data  => { notesHook.addNote(data);  goTo('notes') }}
              onAddLead={data  => { leadsHook.addLead(data);  goTo('leads') }}
            />

            {openTasks > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Open Tasks</p>
                <div className="space-y-2">
                  {tasksHook.tasks
                    .filter(t => t.status === 'open')
                    .sort((a, b) => { const o = { high: 0, medium: 1, low: 2 }; return o[a.priority] - o[b.priority] })
                    .slice(0, 5)
                    .map(task => (
                      <div key={task.id} className="flex items-center gap-3">
                        <button
                          onClick={() => tasksHook.toggleStatus(task.id)}
                          className="w-4 h-4 rounded border border-zinc-600 flex-shrink-0 hover:border-amber-500 transition-colors"
                        />
                        <span className="text-sm text-zinc-300 truncate flex-1">{task.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${task.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : task.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700 text-zinc-400'}`}>
                          {task.priority}
                        </span>
                      </div>
                    ))}
                  {openTasks > 5 && (
                    <button onClick={() => goTo('tasks')} className="text-xs text-zinc-500 hover:text-zinc-300 mt-1 transition-colors">
                      +{openTasks - 5} more tasks →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'links' && <LinksPanel {...linksHook} />}
        {activeTab === 'tasks' && <TasksPanel {...tasksHook} />}
        {activeTab === 'notes' && <NotesPanel {...notesHook} />}
        {activeTab === 'leads' && <LeadsPanel {...leadsHook} />}
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
