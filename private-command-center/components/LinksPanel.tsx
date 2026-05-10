'use client'
import { useState, useMemo } from 'react'
import { Plus, X, Star, ExternalLink, Trash2, Search, Pencil } from 'lucide-react'
import type { LinkItem } from '@/lib/types'
import { formatRelativeDate } from '@/lib/utils'

const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 text-sm'

interface Props {
  links: LinkItem[]
  addLink: (data: Omit<LinkItem, 'id' | 'createdAt'>) => void
  updateLink: (id: string, updates: Partial<LinkItem>) => void
  deleteLink: (id: string) => void
  toggleFavorite: (id: string) => void
}

const emptyForm = { title: '', url: '', category: '', favorite: false }

export default function LinksPanel({ links, addLink, updateLink, deleteLink, toggleFavorite }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => [...new Set(links.map(l => l.category).filter(Boolean))], [links])

  const filtered = useMemo(() => {
    let r = links
    if (filter === 'favorites') r = r.filter(l => l.favorite)
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(l => l.title.toLowerCase().includes(q) || l.url.toLowerCase().includes(q) || l.category.toLowerCase().includes(q))
    }
    return [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [links, filter, search])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (link: LinkItem) => {
    setShowForm(false)
    setEditingId(link.id)
    setForm({ title: link.title, url: link.url, category: link.category, favorite: link.favorite })
  }

  const saveAdd = () => {
    if (!form.url.trim()) return
    addLink({ ...form, title: form.title.trim() || form.url.trim() })
    setShowForm(false)
    setForm(emptyForm)
  }

  const saveEdit = (id: string) => {
    if (!form.url.trim()) return
    updateLink(id, { ...form, title: form.title.trim() || form.url.trim() })
    setEditingId(null)
  }

  const f = (field: keyof typeof emptyForm, val: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: val }))

  const FormFields = ({ onSave, onCancel, saveLabel }: { onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-3">
      <input className={`${inp} w-full`} placeholder="URL *" value={form.url} onChange={e => f('url', e.target.value)} />
      <input className={`${inp} w-full`} placeholder="Title (optional)" value={form.title} onChange={e => f('title', e.target.value)} />
      <div className="flex gap-3 items-center">
        <input className={`${inp} flex-1`} placeholder="Category" value={form.category} onChange={e => f('category', e.target.value)} list="link-cats" />
        {categories.length > 0 && <datalist id="link-cats">{categories.map(c => <option key={c} value={c} />)}</datalist>}
        <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer whitespace-nowrap">
          <input type="checkbox" checked={form.favorite} onChange={e => f('favorite', e.target.checked)} className="w-4 h-4 accent-amber-400" />
          Favorite
        </label>
      </div>
      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">{saveLabel}</button>
        <button onClick={onCancel} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Links</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} />Add Link
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-violet-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-violet-400">New Link</span>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <FormFields onSave={saveAdd} onCancel={() => setShowForm(false)} saveLabel="Save Link" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 gap-1 self-start">
          {(['all', 'favorites'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === f ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
              {f === 'all' ? `All (${links.length})` : `Favorites (${links.filter(l => l.favorite).length})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input className={`${inp} pl-8 w-full`} placeholder="Search links..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">{search ? 'No links match your search.' : 'No links yet. Add your first!'}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(link => (
            <div key={link.id}>
              {editingId === link.id ? (
                <div className="bg-zinc-900 border border-violet-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-violet-400">Edit Link</span>
                    <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
                  </div>
                  <FormFields onSave={() => saveEdit(link.id)} onCancel={() => setEditingId(null)} saveLabel="Update Link" />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-3 group hover:border-zinc-700 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-100 hover:text-violet-400 transition-colors truncate">
                        {link.title}
                      </a>
                      <ExternalLink size={11} className="text-zinc-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-zinc-600 truncate max-w-[200px]">{link.url}</span>
                      {link.category && <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full">{link.category}</span>}
                      <span className="text-xs text-zinc-700">{formatRelativeDate(link.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => toggleFavorite(link.id)} className={`p-1.5 rounded-lg transition-colors ${link.favorite ? 'text-amber-400' : 'text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100'}`}>
                      <Star size={14} fill={link.favorite ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => openEdit(link)} className="p-1.5 rounded-lg text-zinc-700 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => deleteLink(link.id)} className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-colors">
                      <Trash2 size={13} />
                    </button>
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
