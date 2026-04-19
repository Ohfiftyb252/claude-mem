'use client'
import { useState, useMemo } from 'react'
import { Plus, X, Trash2, Pencil, DollarSign } from 'lucide-react'
import type { LeadItem } from '@/lib/types'
import { formatRelativeDate } from '@/lib/utils'

const inp = 'bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-rose-500/50 text-sm'

interface Props {
  leads: LeadItem[]
  addLead: (data: Omit<LeadItem, 'id' | 'createdAt'>) => void
  updateLead: (id: string, updates: Partial<LeadItem>) => void
  deleteLead: (id: string) => void
}

const statusStyles: Record<LeadItem['status'], { badge: string; label: string }> = {
  new:       { badge: 'bg-blue-500/20 text-blue-300',    label: 'New' },
  contacted: { badge: 'bg-amber-500/20 text-amber-300',  label: 'Contacted' },
  won:       { badge: 'bg-emerald-500/20 text-emerald-300', label: 'Won' },
  lost:      { badge: 'bg-zinc-700 text-zinc-400',        label: 'Lost' },
}

const allStatuses: LeadItem['status'][] = ['new', 'contacted', 'won', 'lost']

const emptyForm = { name: '', source: '', status: 'new' as LeadItem['status'], value: '', note: '' }

export default function LeadsPanel({ leads, addLead, updateLead, deleteLead }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filterStatus, setFilterStatus] = useState<LeadItem['status'] | 'all'>('all')

  const filtered = useMemo(() => {
    let r = leads
    if (filterStatus !== 'all') r = r.filter(l => l.status === filterStatus)
    return [...r].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [leads, filterStatus])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length }
    allStatuses.forEach(s => { c[s] = leads.filter(l => l.status === s).length })
    return c
  }, [leads])

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (lead: LeadItem) => {
    setShowForm(false)
    setEditingId(lead.id)
    setForm({ name: lead.name, source: lead.source, status: lead.status, value: lead.value?.toString() || '', note: lead.note || '' })
  }

  const saveAdd = () => {
    if (!form.name.trim()) return
    addLead({ name: form.name.trim(), source: form.source.trim(), status: form.status, value: form.value ? parseFloat(form.value) : undefined, note: form.note.trim() || undefined })
    setShowForm(false)
    setForm(emptyForm)
  }

  const saveEdit = (id: string) => {
    if (!form.name.trim()) return
    updateLead(id, { name: form.name.trim(), source: form.source.trim(), status: form.status, value: form.value ? parseFloat(form.value) : undefined, note: form.note.trim() || undefined })
    setEditingId(null)
  }

  const FormFields = ({ onSave, onCancel, saveLabel }: { onSave: () => void; onCancel: () => void; saveLabel: string }) => (
    <div className="space-y-3">
      <input className={`${inp} w-full`} placeholder="Name *" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
      <div className="flex gap-3">
        <input className={`${inp} flex-1`} placeholder="Source" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))} />
        <select className={`${inp} flex-1`} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as LeadItem['status'] }))}>
          {allStatuses.map(s => <option key={s} value={s}>{statusStyles[s].label}</option>)}
        </select>
      </div>
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input className={`${inp} pl-8 w-full`} placeholder="Value (optional)" type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
        </div>
      </div>
      <textarea className={`${inp} w-full resize-none`} placeholder="Note (optional)" rows={2} value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))} />
      <div className="flex gap-2">
        <button onClick={onSave} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">{saveLabel}</button>
        <button onClick={onCancel} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Leads</h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={15} />Add Lead
        </button>
      </div>

      {showForm && (
        <div className="bg-zinc-900 border border-rose-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-rose-400">New Lead</span>
            <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
          </div>
          <FormFields onSave={saveAdd} onCancel={() => setShowForm(false)} saveLabel="Save Lead" />
        </div>
      )}

      <div className="flex flex-wrap gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        {([['all', `All (${counts.all})`], ...allStatuses.map(s => [s, `${statusStyles[s].label} (${counts[s]})`])] as [string, string][]).map(([f, label]) => (
          <button key={f} onClick={() => setFilterStatus(f as LeadItem['status'] | 'all')} className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filterStatus === f ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-zinc-600">{filterStatus !== 'all' ? `No ${filterStatus} leads.` : 'No leads yet. Start tracking!'}</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(lead => (
            <div key={lead.id}>
              {editingId === lead.id ? (
                <div className="bg-zinc-900 border border-rose-500/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-rose-400">Edit Lead</span>
                    <button onClick={() => setEditingId(null)} className="text-zinc-500 hover:text-zinc-300"><X size={15} /></button>
                  </div>
                  <FormFields onSave={() => saveEdit(lead.id)} onCancel={() => setEditingId(null)} saveLabel="Update Lead" />
                </div>
              ) : (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 group hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-zinc-100">{lead.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[lead.status].badge}`}>{statusStyles[lead.status].label}</span>
                        {lead.value != null && (
                          <span className="text-sm font-semibold text-emerald-400">${lead.value.toLocaleString()}</span>
                        )}
                      </div>
                      {lead.source && <p className="text-sm text-zinc-500 mt-0.5">{lead.source}</p>}
                      {lead.note && <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{lead.note}</p>}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {allStatuses.filter(s => s !== lead.status).map(s => (
                          <button key={s} onClick={() => updateLead(lead.id, { status: s })}
                            className="text-xs text-zinc-500 hover:text-zinc-200 border border-zinc-700 hover:border-zinc-500 px-2 py-0.5 rounded-md transition-colors">
                            → {statusStyles[s].label}
                          </button>
                        ))}
                        <span className="text-xs text-zinc-700 ml-auto">{formatRelativeDate(lead.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(lead)} className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 transition-colors"><Pencil size={13} /></button>
                      <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
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
