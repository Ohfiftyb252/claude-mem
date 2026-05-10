'use client'
import { useState, useEffect } from 'react'
import type { LinkItem, TaskItem, NoteItem, LeadItem } from './types'

function useLocalStorage<T>(key: string, defaultValue: T[]) {
  const [items, setItems] = useState<T[]>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T[]) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(items))
    } catch {}
  }, [key, items])

  return [items, setItems] as const
}

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export function useLinks() {
  const [links, setLinks] = useLocalStorage<LinkItem>('pcc-links', [])
  return {
    links,
    addLink: (data: Omit<LinkItem, 'id' | 'createdAt'>) =>
      setLinks(prev => [...prev, { ...data, id: makeId(), createdAt: new Date().toISOString() }]),
    updateLink: (id: string, updates: Partial<LinkItem>) =>
      setLinks(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l))),
    deleteLink: (id: string) =>
      setLinks(prev => prev.filter(l => l.id !== id)),
    toggleFavorite: (id: string) =>
      setLinks(prev => prev.map(l => (l.id === id ? { ...l, favorite: !l.favorite } : l))),
  }
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<TaskItem>('pcc-tasks', [])
  return {
    tasks,
    addTask: (data: Omit<TaskItem, 'id' | 'createdAt'>) =>
      setTasks(prev => [...prev, { ...data, id: makeId(), createdAt: new Date().toISOString() }]),
    updateTask: (id: string, updates: Partial<TaskItem>) =>
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t))),
    deleteTask: (id: string) =>
      setTasks(prev => prev.filter(t => t.id !== id)),
    toggleStatus: (id: string) =>
      setTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, status: t.status === 'open' ? 'done' : 'open' } : t))
      ),
  }
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<NoteItem>('pcc-notes', [])
  return {
    notes,
    addNote: (data: Omit<NoteItem, 'id' | 'createdAt'>) =>
      setNotes(prev => [...prev, { ...data, id: makeId(), createdAt: new Date().toISOString() }]),
    updateNote: (id: string, updates: Partial<NoteItem>) =>
      setNotes(prev => prev.map(n => (n.id === id ? { ...n, ...updates } : n))),
    deleteNote: (id: string) =>
      setNotes(prev => prev.filter(n => n.id !== id)),
  }
}

export function useLeads() {
  const [leads, setLeads] = useLocalStorage<LeadItem>('pcc-leads', [])
  return {
    leads,
    addLead: (data: Omit<LeadItem, 'id' | 'createdAt'>) =>
      setLeads(prev => [...prev, { ...data, id: makeId(), createdAt: new Date().toISOString() }]),
    updateLead: (id: string, updates: Partial<LeadItem>) =>
      setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...updates } : l))),
    deleteLead: (id: string) =>
      setLeads(prev => prev.filter(l => l.id !== id)),
  }
}
