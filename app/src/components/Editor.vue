<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'

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

function handleInput(e: Event) {
  const target = e.target as HTMLDivElement
  emit('update:modelValue', target.innerText || '')
  emit('save')
}

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 's') {
    e.preventDefault()
    emit('save')
  }
  
  if (e.key === 'Enter') {
    e.preventDefault()
    insertNewLineWithIndent()
  }
}

function insertNewLineWithIndent() {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return
  
  const range = selection.getRangeAt(0)
  const editor = editorRef.value
  if (!editor) return
  
  // 获取当前行内容
  const currentLine = getCurrentLineText()
  
  // 插入换行符和2个缩进空格
  const indent = '　　' // 全角空格
  const newLineNode = document.createTextNode('\n' + indent)
  
  if (range.startContainer.nodeType === Node.TEXT_NODE) {
    const textNode = range.startContainer
    const offset = range.startOffset
    
    // 在当前文本中插入换行和缩进
    textNode.textContent = textNode.textContent?.substring(0, offset) + '\n' + indent + textNode.textContent?.substring(offset) || ''
    
    // 移动光标到新行缩进后面
    range.setStart(textNode, offset + indent.length + 1)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  } else {
    // 在编辑器中插入新节点
    range.insertNode(newLineNode)
    
    // 移动光标到新行缩进后面
    range.setStart(newLineNode, indent.length + 1)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
  }
  
  emit('update:modelValue', editor.innerText || '')
  emit('save')
}

function getCurrentLineText(): string {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return ''
  
  const range = selection.getRangeAt(0)
  const editor = editorRef.value
  if (!editor) return ''
  
  // 获取光标前的所有文本直到换行符
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(editor)
  preCaretRange.setEnd(range.endContainer, range.endOffset)
  
  const tempDiv = document.createElement('div')
  tempDiv.appendChild(preCaretRange.cloneContents())
  const text = tempDiv.textContent || ''
  
  // 获取当前行的起始位置
  const lines = text.split('\n')
  return lines[lines.length - 1]
}

function handleClick() {
  editorRef.value?.focus()
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
})

onMounted(() => {
  focusEditor()
})

defineExpose({ focusEditor })
</script>

<template>
  <div class="editor-wrapper" @click="handleClick">
    <div
      ref="editorRef"
      class="editor-content editor-cursor"
      contenteditable="true"
      spellcheck="false"
      @input="handleInput"
      @keydown="handleKeydown"
      :style="{
        fontFamily,
        fontSize: `${fontSize}px`,
        lineHeight: `${lineHeight}px`,
        color: textColor,
        minHeight: '100%'
      }"
      :data-placeholder="modelValue ? '' : '点击此处开始书写...'"
    />
  </div>
</template>

<style scoped>
.editor-wrapper {
  padding: 40px;
  min-height: calc(100vh - 120px);
  cursor: text;
}

.editor-content {
  outline: none;
  min-height: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  cursor: text;
  font-size: 28px;
  line-height: 48px;
  letter-spacing: 0;
  text-align: left;
  padding-left: 0;
  margin-left: 0;
  font-synthesis: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  pointer-events: none;
  font-size: 28px;
  line-height: 48px;
  letter-spacing: 0;
}

.editor-content:focus {
  outline: none;
}

.editor-cursor {
  caret-color: currentColor;
  display: inline;
}
</style>
