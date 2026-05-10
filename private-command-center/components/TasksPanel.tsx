'use client'
import { useState, useMemo } from 'react'
import { Plus, X, Trash2, Pencil, CheckSquare, Square, Calendar, AlertTriangle } from 'lucide-react'
import type { TaskItem } from '@/lib/types'
import { formatDate, isOverdue } from '@/lib/utils'

const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 text-sm'

interface Props {
  tasks: TaskItem[]
  addTask: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updates: Partial<TaskItem>) => void
  deleteTask: (id: string) => void
  toggleStatus: (id: string) => void
}

const priorityStyles = {
  high:   { badge: 'bg-rose-500/20 text-rose-300',   label: 'High' },
  medium: { badge: 'bg-amber-500/20 text-amber-300',  label: 'Med' },
  low:    { badge: 'bg-zinc-700 text-zinc-400',        label: 'Low' },
}

const emptyForm = { title: '', priority: 'medium' as TaskItem['priority'], dueDate: '' }

export default function TasksPanel({ tasks, addTask, updateTask, deleteTask, toggleStatus }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'open' | 'all' | 'done'>('open')

  const filtered = useMemo(() => {
    let r = tasks
    if (filter === 'open') r = r.filter(t => t.status === 'open')
    if (filter === 'done') r = r.filter(t => t.status === 'done')
    return [...r].sort((a, b) => {
      if (a.status !== b.status) return a.status === 'open' ? -1 : 1
      const pOrder = { high: 0, medium: 1, low: 2 }
      return pOrder[a.priority] - pOrder[b.priority]
    })
  }, [tasks, filter])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (task: TaskItem) => {
    setShowForm(false)
    setEditingId(task.id)
    setForm({ title: task.title, priority: task.priority, dueDate: task.dueDate || '' })
  }

  const saveAdd = () => {
    if (!form.title.trim()) return
    addTask({ title: form.title.trim(), priority: form.priority, status: 'open', dueDate: form.dueDate || undefined })
    setShowForm(false)
    setForm(emptyForm)
  }

  const saveEdit = (id: string) => {
    if (!form.title.trim()) return
    updateTask(id, { title: form.title.trim(), priority: form.priority, dueDate: form.dueDate || undefined })
    setEditingId(null)
  }

  const counts = { open: tasks.filter(t => t.status === 'open').length, done: tasks.filter(t => t.status === 'done').length }

  const FormFields = ({ onSave, onCancel, saveLabel }: { onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-3">
      <input className={`${inp} w-full`} placeholder="Task title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        onKeyDown={e => e.key === 'Enter' && onSave()} />
      <div className="flex gap-3">
        <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskItem['priority'] }))} className={`${inp} flex-1`}>
          <option value="high">High priority</option>
          <option value="medium">Medium priority</option>
          <option value="low">Low priority</option>
        </select>
        <input type="date" className={`${inp} flex-1`} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">{saveLabel}</button>
        <button onClick={onCancel} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Tasks</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} />Add Task
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-400">New Task</span>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <FormFields onSave={saveAdd} onCancel={() => setShowForm(false)} saveLabel="Save Task" />
        </div>
      )}

      <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1 self-start w-fit">
        {([['open', `Open (${counts.open})`], ['all', `All (${tasks.length})`], ['done', `Done (${counts.done})`]] as const).map(([f, label]) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">{filter === 'open' ? 'No open tasks. All clear!' : 'No tasks here.'}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => (
            <div key={task.id}>
              {editingId === task.id ? (
                <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-400">Edit Task</span>
                    <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
                  </div>
                  <FormFields onSave={() => saveEdit(task.id)} onCancel={() => setEditingId(null)} saveLabel="Update Task" />
                </div>
              ) : (
                <div className={`bg-zinc-900 border rounded-xl px-4 py-3 flex items-center gap-3 group transition-colors ${task.status === 'done' ? 'border-zinc-800/50 opacity-60' : 'border-zinc-800 hover:border-zinc-700'}`}>
                  <button onClick={() => toggleStatus(task.id)} className="flex-shrink-0 text-zinc-500 hover:text-amber-400 transition-colors">
                    {task.status === 'done' ? <CheckSquare size={18} className="text-amber-500" /> : <Square size={18} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-zinc-100 ${task.status === 'done' ? 'line-through text-zinc-500' : ''}`}>{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityStyles[task.priority].badge}`}>
                        {priorityStyles[task.priority].label}
                      </span>
                      {task.dueDate && (
                        <span className={`flex items-center gap-1 text-xs ${isOverdue(task.dueDate) && task.status === 'open' ? 'text-rose-400' : 'text-zinc-500'}`}>
                          {isOverdue(task.dueDate) && task.status === 'open' && <AlertTriangle size={10} />}
                          <Calendar size={10} />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(task)} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => deleteTask(task.id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
