import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { StoredDocument } from '../types'
import { saveDocument, loadDocument, saveCurrentDocId, loadCurrentDocId, createNewDocument, getAllDocuments } from '../utils/storage'
import { countWords, debounce } from '../utils/helpers'

const content = ref('')
const wordCount = ref(0)
const writingTime = ref(0)
const lastSaveTime = ref<Date | null>(null)
const currentDocId = ref<string | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null

export function useEditor() {
  const isEditing = computed(() => content.value.length > 0)

  function updateContent(newContent: string) {
    content.value = newContent
    wordCount.value = countWords(newContent)
  }

  function startTimer() {
    if (timerInterval) return
    timerInterval = setInterval(() => {
      writingTime.value++
    }, 1000)
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  const saveDocumentDebounced = debounce(() => {
    if (!currentDocId.value) return
    const doc: StoredDocument = {
      id: currentDocId.value,
      title: content.value.substring(0, 20) || '无标题文档',
      content: content.value,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: wordCount.value
    }
    saveDocument(doc)
    lastSaveTime.value = new Date()
  }, 2000)

  function saveCurrentDocument() {
    saveDocumentDebounced()
  }

  function loadCurrentDocument() {
    const docId = loadCurrentDocId()
    if (docId) {
      const doc = loadDocument(docId)
      if (doc) {
        content.value = doc.content
        wordCount.value = doc.wordCount
        currentDocId.value = doc.id
        return
      }
    }
    createNewDoc()
  }

  function createNewDoc() {
    const newDoc = createNewDocument()
    content.value = ''
    wordCount.value = 0
    writingTime.value = 0
    currentDocId.value = newDoc.id
    saveCurrentDocId(newDoc.id)
    saveDocument(newDoc)
  }

  function exportDocument(format: 'txt' | 'md') {
    const title = content.value.substring(0, 20) || '无标题文档'
    let filename = `${title}.${format}`
    let contentToExport = content.value
    let mimeType = format === 'txt' ? 'text/plain' : 'text/markdown'

    if (format === 'md') {
      contentToExport = `# ${title}\n\n${content.value}`
    }

    const blob = new Blob([contentToExport], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function getAllDocs() {
    return getAllDocuments()
  }

  function openDocument(docId: string) {
    const doc = loadDocument(docId)
    if (doc) {
      content.value = doc.content
      wordCount.value = doc.wordCount
      currentDocId.value = doc.id
      saveCurrentDocId(docId)
    }
  }

  onMounted(() => {
    loadCurrentDocument()
    startTimer()
  })

  onUnmounted(() => {
    stopTimer()
    saveDocumentDebounced()
  })

  return {
    content,
    wordCount,
    writingTime,
    lastSaveTime,
    currentDocId,
    isEditing,
    updateContent,
    saveCurrentDocument,
    loadCurrentDocument,
    createNewDoc,
    exportDocument,
    getAllDocs,
    openDocument,
    startTimer,
    stopTimer
  }
}
