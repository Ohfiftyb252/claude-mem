'use client'
import { useState, useMemo } from 'react'
import { Plus, X, Trash2, Pencil, Search, ChevronDown, ChevronUp } from 'lucide-react'
import type { NoteItem } from '@/lib/types'
import { formatRelativeDate } from '@/lib/utils'

const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 text-sm'

interface Props {
  notes: NoteItem[]
  addNote: (data: Omit<NoteItem, 'id' | 'createdAt'>) => void
  updateNote: (id: string, updates: Partial<NoteItem>) => void
  deleteNote: (id: string) => void
}

const emptyForm = { title: '', content: '', tags: '' }

export default function NotesPanel({ notes, addNote, updateNote, deleteNote }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let r = notes
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)))
    }
    return [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [notes, search])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (note: NoteItem) => {
    setShowForm(false)
    setEditingId(note.id)
    setForm({ title: note.title, content: note.content, tags: note.tags.join(', ') })
    setExpandedId(null)
  }

  const parseTags = (s: string) => s.split(',').map(t => t.trim()).filter(Boolean)

  const saveAdd = () => {
    if (!form.title.trim()) return
    addNote({ title: form.title.trim(), content: form.content.trim(), tags: parseTags(form.tags) })
    setShowForm(false)
    setForm(emptyForm)
  }

  const saveEdit = (id: string) => {
    if (!form.title.trim()) return
    updateNote(id, { title: form.title.trim(), content: form.content.trim(), tags: parseTags(form.tags) })
    setEditingId(null)
  }

  const FormFields = ({ onSave, onCancel, saveLabel }: { onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-3">
      <input className={`${inp} w-full`} placeholder="Title *" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
      <textarea className={`${inp} w-full resize-none`} placeholder="Content" rows={5} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} />
      <input className={`${inp} w-full`} placeholder="Tags (comma-separated)" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">{saveLabel}</button>
        <button onClick={onCancel} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Notes</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} />Add Note
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-emerald-400">New Note</span>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <FormFields onSave={saveAdd} onCancel={() => setShowForm(false)} saveLabel="Save Note" />
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
        <input className={`${inp} pl-8 w-full`} placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">{search ? 'No notes match.' : 'No notes yet. Capture your thoughts!'}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(note => (
            <div key={note.id}>
              {editingId === note.id ? (
                <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-emerald-400">Edit Note</span>
                    <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
                  </div>
                  <FormFields onSave={() => saveEdit(note.id)} onCancel={() => setEditingId(null)} saveLabel="Update Note" />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-zinc-100 truncate">{note.title}</p>
                        <span className="text-xs text-zinc-600 flex-shrink-0">{formatRelativeDate(note.createdAt)}</span>
                      </div>
                      {note.content && (
                        <p className={`text-sm text-zinc-400 mt-1 ${expandedId === note.id ? 'whitespace-pre-wrap' : 'truncate'}`}>
                          {note.content}
                        </p>
                      )}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map(tag => (
                            <span key={tag} className="text-xs bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {note.content && (
                        <button onClick={() => setExpandedId(expandedId === note.id ? null : note.id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 transition-colors">
                          {expandedId === note.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      )}
                      <button onClick={() => openEdit(note)} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-all"><Pencil size={13} /></button>
                      <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={13} /></button>
                    </div>
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
