export type Tab = 'dashboard' | 'links' | 'tasks' | 'notes' | 'leads'

export type LinkItem = {
  id: string
  title: string
  url: string
  category: string
  favorite: boolean
  createdAt: string
}

export type TaskItem = {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'done'
  dueDate?: string
  createdAt: string
}

export type NoteItem = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
}

export type LeadItem = {
  id: string
  name: string
  source: string
  status: 'new' | 'contacted' | 'won' | 'lost'
  value?: number
  note?: string
  createdAt: string
}
