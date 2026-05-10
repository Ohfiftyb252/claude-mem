'use client'
import { useState } from 'react'
import { Link2, CheckSquare, FileText, Users, X } from 'lucide-react'
import type { LinkItem, TaskItem, NoteItem, LeadItem } from '@/lib/types'

type FormType = 'link' | 'task' | 'note' | 'lead' | null

interface Props {
  onAddLink: (data: Omit<LinkItem, 'id' | 'createdAt'>) => void
  onAddTask: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void
  onAddNote: (data: Omit<NoteItem, 'id' | 'createdAt'>) => void
  onAddLead: (data: Omit<LeadItem, 'id' | 'createdAt'>) => void
}

const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 text-sm w-full'
const btn = 'flex-1 py-2 rounded-lg text-sm font-medium transition-colors'

export default function QuickCapture({ onAddLink, onAddTask, onAddNote, onAddLead }: Props) {
  const [text, setText] = useState('')
  const [activeForm, setActiveForm] = useState<FormType>(null)

  const [linkUrl, setLinkUrl] = useState('')
  const [linkTitle, setLinkTitle] = useState('')
  const [linkCategory, setLinkCategory] = useState('')

  const [taskTitle, setTaskTitle] = useState('')
  const [taskPriority, setTaskPriority] = useState<TaskItem['priority']>('medium')
  const [taskDueDate, setTaskDueDate] = useState('')

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteTags, setNoteTags] = useState('')

  const [leadName, setLeadName] = useState('')
  const [leadSource, setLeadSource] = useState('')
  const [leadStatus, setLeadStatus] = useState<LeadItem['status']>('new')
  const [leadValue, setLeadValue] = useState('')
  const [leadNote, setLeadNote] = useState('')

  const t = text.trim()
  const looksLikeUrl = t.startsWith('http://') || t.startsWith('https://') || /^[\w-]+\.\w{2,}/.test(t)

  const openForm = (type: FormType) => {
    if (type === 'link') {
      setLinkUrl(looksLikeUrl ? t : '')
      setLinkTitle(looksLikeUrl ? '' : t)
      setLinkCategory('')
    } else if (type === 'task') {
      setTaskTitle(t)
      setTaskPriority('medium')
      setTaskDueDate('')
    } else if (type === 'note') {
      const lines = t.split('\n')
      setNoteTitle(lines[0]?.slice(0, 60) || 'Quick Note')
      setNoteContent(t)
      setNoteTags('')
    } else if (type === 'lead') {
      setLeadName(t)
      setLeadSource('')
      setLeadStatus('new')
      setLeadValue('')
      setLeadNote('')
    }
    setActiveForm(type)
  }

  const reset = () => {
    setText('')
    setActiveForm(null)
  }

  const saveLink = () => {
    if (!linkUrl.trim()) return
    onAddLink({ title: linkTitle.trim() || linkUrl.trim(), url: linkUrl.trim(), category: linkCategory.trim(), favorite: false })
    reset()
  }

  const saveTask = () => {
    if (!taskTitle.trim()) return
    onAddTask({ title: taskTitle.trim(), priority: taskPriority, status: 'open', dueDate: taskDueDate || undefined })
    reset()
  }

  const saveNote = () => {
    if (!noteTitle.trim()) return
    onAddNote({ title: noteTitle.trim(), content: noteContent.trim(), tags: noteTags.split(',').map(s => s.trim()).filter(Boolean) })
    reset()
  }

  const saveLead = () => {
    if (!leadName.trim()) return
    onAddLead({ name: leadName.trim(), source: leadSource.trim(), status: leadStatus, value: leadValue ? parseFloat(leadValue) : undefined, note: leadNote.trim() || undefined })
    reset()
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Quick Capture</p>

      {!activeForm && (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type a URL, task, note, or lead name..."
            rows={3}
            className={`${inp} resize-none`}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([
              { type: 'link' as const, icon: Link2, label: 'Link', color: 'border-violet-500/30 text-violet-400 hover:bg-violet-500/10' },
              { type: 'task' as const, icon: CheckSquare, label: 'Task', color: 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' },
              { type: 'note' as const, icon: FileText, label: 'Note', color: 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' },
              { type: 'lead' as const, icon: Users, label: 'Lead', color: 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10' },
            ]).map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => openForm(type)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-colors ${color}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {activeForm === 'link' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-violet-400">Save as Link</span>
            <button onClick={() => setActiveForm(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <input className={inp} placeholder="URL *" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} />
          <input className={inp} placeholder="Title (optional)" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} />
          <input className={inp} placeholder="Category (optional)" value={linkCategory} onChange={e => setLinkCategory(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={saveLink} className={`${btn} bg-violet-600 hover:bg-violet-500 text-white`}>Save Link</button>
            <button onClick={() => setActiveForm(null)} className={`${btn} bg-zinc-800 hover:bg-zinc-700 text-zinc-300`}>Cancel</button>
          </div>
        </div>
      )}

      {activeForm === 'task' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-400">Save as Task</span>
            <button onClick={() => setActiveForm(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <input className={inp} placeholder="Task title *" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
          <div className="flex gap-2">
            <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as TaskItem['priority'])} className={`${inp} flex-1`}>
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input type="date" className={`${inp} flex-1`} value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={saveTask} className={`${btn} bg-amber-600 hover:bg-amber-500 text-white`}>Save Task</button>
            <button onClick={() => setActiveForm(null)} className={`${btn} bg-zinc-800 hover:bg-zinc-700 text-zinc-300`}>Cancel</button>
          </div>
        </div>
      )}

      {activeForm === 'note' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">Save as Note</span>
            <button onClick={() => setActiveForm(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <input className={inp} placeholder="Title *" value={noteTitle} onChange={e => setNoteTitle(e.target.value)} />
          <textarea className={`${inp} resize-none`} placeholder="Content" rows={3} value={noteContent} onChange={e => setNoteContent(e.target.value)} />
          <input className={inp} placeholder="Tags (comma-separated)" value={noteTags} onChange={e => setNoteTags(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={saveNote} className={`${btn} bg-emerald-600 hover:bg-emerald-500 text-white`}>Save Note</button>
            <button onClick={() => setActiveForm(null)} className={`${btn} bg-zinc-800 hover:bg-zinc-700 text-zinc-300`}>Cancel</button>
          </div>
        </div>
      )}

      {activeForm === 'lead' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-rose-400">Save as Lead</span>
            <button onClick={() => setActiveForm(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <input className={inp} placeholder="Name *" value={leadName} onChange={e => setLeadName(e.target.value)} />
          <div className="flex gap-2">
            <input className={`${inp} flex-1`} placeholder="Source" value={leadSource} onChange={e => setLeadSource(e.target.value)} />
            <input className={`${inp} flex-1`} placeholder="Value ($)" type="number" value={leadValue} onChange={e => setLeadValue(e.target.value)} />
          </div>
          <textarea className={`${inp} resize-none`} placeholder="Note (optional)" rows={2} value={leadNote} onChange={e => setLeadNote(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={saveLead} className={`${btn} bg-rose-600 hover:bg-rose-500 text-white`}>Save Lead</button>
            <button onClick={() => setActiveForm(null)} className={`${btn} bg-zinc-800 hover:bg-zinc-700 text-zinc-300`}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
