import { ref, computed } from 'vue';
import type { ThemeType, ThemeConfig } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';
const themes: ThemeConfig[] = [
 { name: '米黄稿纸', value: 'rice-paper', bgColor: '#F5F0E6', textColor: '#2C2C2C', lineColor: '#D4C4A8', description: '温暖的米黄色稿纸' },
 { name: '仿古宣纸', value: 'antique-paper', bgColor: '#E8DFC4', textColor: '#3D3229', lineColor: '#C9BB9A', description: '古朴典雅的宣纸质感' },
 { name: '纯白纸张', value: 'white-paper', bgColor: '#FFFFFF', textColor: '#1A1A1A', lineColor: '#E0E0E0', description: '干净简洁的白纸' },
];
const currentTheme = ref<ThemeType>('rice-paper');
export function useTheme() {
 const themeConfig = computed(() => {
 return themes.find(t => t.value === currentTheme.value) || themes[0];
 });
 const bgColor = computed(() => themeConfig.value.bgColor);
 const textColor = computed(() => themeConfig.value.textColor);
 const lineColor = computed(() => themeConfig.value.lineColor);
 function setTheme(theme: ThemeType) {
 currentTheme.value = theme;
 saveSettings({
 ...loadSettings(),
 theme
 });
 }
 function loadTheme() {
 const settings = loadSettings();
 currentTheme.value = settings.theme as ThemeType;
 }
 return {
 currentTheme,
 themes,
 themeConfig,
 bgColor,
 textColor,
 lineColor,
 setTheme,
 loadTheme
 };
}
