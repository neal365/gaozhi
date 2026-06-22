import type { StoredDocument, StoredSettings } from '../types'

const DOCUMENTS_KEY = 'flowstate_documents'
const SETTINGS_KEY = 'flowstate_settings'
const CURRENT_DOC_ID_KEY = 'flowstate_current_doc_id'

export function saveDocument(doc: StoredDocument): void {
  const docs = getAllDocuments()
  const index = docs.findIndex(d => d.id === doc.id)
  if (index >= 0) {
    docs[index] = doc
  } else {
    docs.push(doc)
  }
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
}

export function loadDocument(id: string): StoredDocument | null {
  const docs = getAllDocuments()
  return docs.find(d => d.id === id) || null
}

export function deleteDocument(id: string): void {
  const docs = getAllDocuments().filter(d => d.id !== id)
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs))
}

export function getAllDocuments(): StoredDocument[] {
  const data = localStorage.getItem(DOCUMENTS_KEY)
  return data ? JSON.parse(data) : []
}

export function saveSettings(settings: StoredSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSettings(): StoredSettings {
  const data = localStorage.getItem(SETTINGS_KEY)
  if (data) {
    return JSON.parse(data)
  }
  return {
    theme: 'rice-paper',
    fontStyle: 'kai',
    fontSize: 20,
    lineHeight: 48,
    paperWidth: 800
  }
}

export function saveCurrentDocId(id: string): void {
  localStorage.setItem(CURRENT_DOC_ID_KEY, id)
}

export function loadCurrentDocId(): string | null {
  return localStorage.getItem(CURRENT_DOC_ID_KEY)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export function createNewDocument(): StoredDocument {
  const now = new Date()
  return {
    id: generateId(),
    title: '无标题文档',
    content: '',
    createdAt: now,
    updatedAt: now,
    wordCount: 0
  }
}
