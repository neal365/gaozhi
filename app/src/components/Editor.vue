<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'

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

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const colsPerLine = 20
const rowsPerPage = 20

const totalWidth = computed(() => colsPerLine * props.lineHeight)
const totalHeight = computed(() => rowsPerPage * props.lineHeight)
const paddingH = computed(() => (props.lineHeight - props.fontSize) / 2)
const letterSpacingValue = computed(() => props.lineHeight - props.fontSize)

const textareaStyle = computed(() => ({
  fontFamily: props.fontFamily,
  fontSize: `${props.fontSize}px`,
  lineHeight: `${props.lineHeight}px`,
  color: props.textColor,
  width: `${totalWidth.value}px`,
  height: `${totalHeight.value}px`,
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: `${paddingH.value}px`,
  paddingRight: `${paddingH.value}px`,
  letterSpacing: `${letterSpacingValue.value}px`,
}))

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
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
    const target = e.target as HTMLTextAreaElement
    const pos = target.selectionStart
    const insertText = '\n  '
    const newValue = props.modelValue.slice(0, pos) + insertText + props.modelValue.slice(pos)
    emit('update:modelValue', newValue)
    emit('save')
    nextTick(() => {
      target.selectionStart = pos + insertText.length
      target.selectionEnd = pos + insertText.length
    })
    return
  }
}

function focusEditor() {
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

onMounted(() => {
  focusEditor()
})

watch(() => props.modelValue, (newVal) => {
  if (textareaRef.value && textareaRef.value.value !== newVal) {
    const pos = textareaRef.value.selectionStart
    textareaRef.value.value = newVal
    textareaRef.value.selectionStart = pos
    textareaRef.value.selectionEnd = pos
  }
})

defineExpose({ focusEditor })
</script>

<template>
  <div class="editor-container">
    <textarea
      ref="textareaRef"
      class="editor-textarea"
      :style="textareaStyle"
      :value="modelValue"
      spellcheck="false"
      @input="handleInput"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style scoped>
.editor-container {
  width: fit-content;
  margin: 0 auto;
}

.editor-textarea {
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  margin: 0;
  overflow: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'KaiTi', 'STKaiti', 'SimSun', 'SimHei', serif;
  caret-color: currentColor;
  vertical-align: top;
}

.editor-textarea::selection {
  background-color: rgba(180, 140, 100, 0.3);
}

.editor-textarea::-moz-selection {
  background-color: rgba(180, 140, 100, 0.3);
}

.editor-textarea::-webkit-scrollbar {
  display: none;
}
</style>
