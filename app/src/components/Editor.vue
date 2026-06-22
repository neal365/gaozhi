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
}

.editor-content:empty::before {
  content: attr(data-placeholder);
  color: #aaa;
  pointer-events: none;
}

.editor-content:focus {
  outline: none;
}

.editor-cursor {
  caret-color: currentColor;
}
</style>
