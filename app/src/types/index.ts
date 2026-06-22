export type ThemeType = 'rice-paper' | 'antique-paper' | 'white-paper'

export type FontStyle = 'kai' | 'xing' | 'li' | 'song'

export interface AppState {
  theme: ThemeType
  fontStyle: FontStyle
  fontSize: number
  lineHeight: number
  paperWidth: number
  content: string
  isFullscreen: boolean
  showToolbar: boolean
  showStatusBar: boolean
  wordCount: number
  writingTime: number
  lastSaveTime: Date | null
}

export interface StoredDocument {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  wordCount: number
}

export interface StoredSettings {
  theme: string
  fontStyle: string
  fontSize: number
  lineHeight: number
  paperWidth: number
}

export interface ThemeConfig {
  name: string
  value: ThemeType
  bgColor: string
  textColor: string
  lineColor: string
  description: string
}

export interface FontConfig {
  name: string
  value: FontStyle
  fontFamily: string
  className: string
  description: string
}
