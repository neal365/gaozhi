import { ref, computed } from 'vue'
import type { FontStyle, FontConfig } from '../types'
import { saveSettings, loadSettings } from '../utils/storage'

const fonts: FontConfig[] = [
  { name: '楷体', value: 'kai', fontFamily: "'KaiTi', 'STKaiti', serif", className: 'font-kai', description: '端庄典雅的楷书风格' },
  { name: '行书', value: 'xing', fontFamily: "'Ma Shan Zheng', 'KaiTi', serif", className: 'font-xing', description: '流畅自然的行书风格' },
  { name: '隶书', value: 'li', fontFamily: "'LiSu', 'STLiti', serif", className: 'font-li', description: '古朴厚重的隶书风格' },
  { name: '宋体', value: 'song', fontFamily: "'SimSun', 'STSong', serif", className: 'font-song', description: '清晰工整的宋体风格' },
]

const currentFontStyle = ref<FontStyle>('kai')
const fontSize = ref(28)

export function useFont() {
  const fontConfig = computed(() => {
    return fonts.find(f => f.value === currentFontStyle.value) || fonts[0]
  })

  const fontFamily = computed(() => fontConfig.value.fontFamily)
  const fontClassName = computed(() => fontConfig.value.className)

  function setFontStyle(font: FontStyle) {
    currentFontStyle.value = font
    saveSettings({
      ...loadSettings(),
      fontStyle: font
    })
  }

  function setFontSize(size: number) {
    fontSize.value = size
    saveSettings({
      ...loadSettings(),
      fontSize: size
    })
  }

  function loadFontSettings() {
    const settings = loadSettings()
    currentFontStyle.value = settings.fontStyle as FontStyle
    fontSize.value = settings.fontSize
  }

  return {
    currentFontStyle,
    fonts,
    fontSize,
    fontConfig,
    fontFamily,
    fontClassName,
    setFontStyle,
    setFontSize,
    loadFontSettings
  }
}