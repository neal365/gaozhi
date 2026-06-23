<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  fontFamily: string
  fontSize: number
  lineHeight: number
  textColor: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'save'): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)

const letterSpacing = computed(() => {
  return `${props.lineHeight - props.fontSize}px`
})

function handleInput(e: Event) {
  const target = e.target as HTMLDivElement
  let text = target.innerText || ''
  text = text.replace(/\s+/g, ' ')
  emit('update:modelValue', text)
  emit('save')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    emit('save')
    return
  }
  
  if (e.key === 'Enter') {
    e.preventDefault()
    insertNewLineWithIndent()
    return
  }
  
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const text = range.startContainer.textContent || ''
      const pos = range.startOffset
      
      if (text[pos] && !text[pos].match(/\s/)) {
        e.preventDefault()
      }
    }
  }
}

function insertNewLineWithIndent() {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  
  const range = selection.getRangeAt(0)
  const editor = editorRef.value
  if (!editor) return
  
  const text = editor.innerText || ''
  const pos = getCaretPosition()
  
  const newText = text.substring(0, pos) + '\n  ' + text.substring(pos)
  editor.innerText = newText
  emit('update:modelValue', newText)
  emit('save')
  
  nextTick(() => {
    setCaretPosition(pos + 3)
  })
}

function getCaretPosition(): number {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return 0
  
  const range = selection.getRangeAt(0)
  const container = range.startContainer
  
  if (container.nodeType === Node.TEXT_NODE) {
    return range.startOffset
  }
  
  let count = 0
  const treeWalker = document.createTreeWalker(
    editorRef.value!,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode as Text
    if (node === container) {
      count += range.startOffset
      break
    }
    count += node.length
  }
  
  return count
}

function setCaretPosition(pos: number) {
  const editor = editorRef.value
  if (!editor) return
  
  const treeWalker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )
  
  let currentPos = 0
  let found = false
  
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode as Text
    const endPos = currentPos + node.length
    
    if (pos <= endPos) {
      const range = document.createRange()
      range.setStart(node, pos - currentPos)
      range.collapse(true)
      
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
      found = true
      break
    }
    
    currentPos = endPos
  }
  
  if (!found && editor.childNodes.length > 0) {
    const lastChild = editor.childNodes[editor.childNodes.length - 1]
    if (lastChild.nodeType === Node.TEXT_NODE) {
      const range = document.createRange()
      range.setStart(lastChild, (lastChild as Text).length)
      range.collapse(true)
      
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }
  
  editor.focus()
}

function handleClick(e: MouseEvent) {
  const editor = editorRef.value
  if (!editor) return
  editor.focus()
  
  nextTick(() => {
    const selection = window.getSelection()
    if (!selection) return
    
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY)
    if (range) {
      const rect = range.getBoundingClientRect()
      const cellSize = props.lineHeight
      
      const editorRect = editor.getBoundingClientRect()
      const x = rect.left - editorRect.left
      const y = rect.top - editorRect.top
      
      const col = Math.round(x / cellSize)
      const row = Math.round(y / cellSize)
      
      const pos = row * getColsPerLine() + col
      const textLength = editor.innerText.length
      const actualPos = Math.min(pos, textLength)
      
      setCaretPosition(actualPos)
    }
  })
}

function getColsPerLine(): number {
  const editor = editorRef.value
  if (!editor) return 20
  
  const width = editor.offsetWidth
  return Math.floor(width / props.lineHeight)
}

function focusEditor() {
  nextTick(() => {
    editorRef.value?.focus()
  })
}

watch(() => props.modelValue, (newValue) => {
  if (editorRef.value && editorRef.value.innerText !== newValue) {
    editorRef.value.innerText = newValue
  }
}, { immediate: true })

onMounted(() => {
  if (props.modelValue) {
    editorRef.value!.innerText = props.modelValue
  }
  focusEditor()
})

defineExpose({ focusEditor })
</script>

<template>
  <div
    ref="editorRef"
    class="editor-content"
    contenteditable="true"
    spellcheck="false"
    @click="handleClick"
    @input="handleInput"
    @keydown="handleKeydown"
    :style="{
      fontFamily,
      fontSize: `${fontSize}px`,
      lineHeight: `${lineHeight}px`,
      color: textColor,
      letterSpacing
    }"
    :data-placeholder="modelValue ? '' : '点击开始书写...'"
  />
</template>

<style scoped>
.editor-content {
  outline: none;
  min-height: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-word;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
  padding: 0;
  margin: 0;
  caret-color: currentColor;
  text-align: center;
  letter-spacing: 0;
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
}

.editor-content:focus {
  outline: none;
}

.editor-content ::selection,
.editor-content::-moz-selection {
  background-color: rgba(180, 140, 100, 0.3);
}
</style>