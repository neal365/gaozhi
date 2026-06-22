# FlowState 心流写作 - 设计文档

## 1. 设计概述

### 1.1 设计目标
- 创建一个简洁、优雅的沉浸式写作界面
- 还原纸笔书写的温度与仪式感
- 最小化干扰元素，最大化专注体验
- 支持多平台响应式适配

### 1.2 设计原则
- **极简主义**：去除一切非必要元素
- **沉浸式**：全屏无干扰的写作环境
- **温暖感**：暖色调纸张背景，手写字体
- **易用性**：直观的操作，低学习成本

---

## 2. 视觉设计

### 2.1 色彩方案

| 颜色用途 | 颜色值 | 说明 |
|---------|--------|------|
| 米黄稿纸 | #F5F0E6 | 温暖的纸张底色 |
| 仿古宣纸 | #E8DFC4 | 略带陈旧感的宣纸色 |
| 纯白纸张 | #FFFFFF | 干净的白色背景 |
| 文字颜色 | #2C2C2C | 深灰色，护眼不刺眼 |
| 横线颜色 | #D4C4A8 | 浅色横线 |
| 竖线颜色 | #E0D4BC | 浅色竖线 |
| 强调色 | #8B7355 | 深棕色，用于按钮和交互元素 |
| 辅助色 | #A6927A | 中棕色，用于次要元素 |

### 2.2 字体方案

| 字体风格 | 字体名称 | 来源 |
|---------|---------|------|
| 楷体 | 楷体_GB2312 / KaiTi | 系统字体 + Web Font |
| 行书 | Ma Shan Zheng | Google Fonts |
| 隶书 | LiSu | 系统字体 |
| 标题字体 | Noto Serif SC | Google Fonts |

### 2.3 布局设计

#### 2.3.1 整体布局
```
┌─────────────────────────────────────────────────────┐
│                    顶部工具栏（可隐藏）              │
│  [字体选择] [主题切换] [全屏] [保存] [导出] [统计]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│              主写作区域（仿真稿纸背景）               │
│                                                     │
│     ┌──────────────────────────────────────┐        │
│     │                                      │        │
│     │    横线格 / 竖线格稿纸背景            │        │
│     │    用户输入的手写字体文字             │        │
│     │                                      │        │
│     └──────────────────────────────────────┘        │
│                                                     │
├─────────────────────────────────────────────────────┤
│                    底部状态栏（可隐藏）              │
│  [字数统计] [写作时长] [当前时间]                     │
└─────────────────────────────────────────────────────┘
```

#### 2.3.2 稿纸布局参数
| 参数 | 默认值 | 可调范围 |
|-----|--------|---------|
| 行间距 | 48px | 32px - 64px |
| 字间距 | 2px | 0px - 8px |
| 纸张宽度 | 800px | 600px - 1000px |
| 边距 | 40px | 20px - 60px |

---

## 3. 组件架构

### 3.1 组件树结构
```
App.vue (根组件)
├── Toolbar.vue (顶部工具栏)
│   ├── FontSelector.vue (字体选择器)
│   ├── ThemeSelector.vue (主题选择器)
│   ├── ActionButtons.vue (操作按钮组)
│   └── StatisticsButton.vue (统计按钮)
├── WritingArea.vue (主写作区域)
│   ├── PaperBackground.vue (稿纸背景)
│   └── Editor.vue (文本编辑器)
├── StatusBar.vue (底部状态栏)
│   ├── WordCounter.vue (字数统计)
│   ├── Timer.vue (写作时长)
│   └── Clock.vue (当前时间)
└── StatisticsPanel.vue (统计面板，抽屉式)
```

### 3.2 组件职责说明

| 组件 | 职责 | 状态管理 |
|-----|------|---------|
| App.vue | 全局状态管理、组件协调 | 主题、字体、全屏状态 |
| Toolbar.vue | 顶部操作栏 | 无，传递事件 |
| FontSelector.vue | 字体风格选择 | 当前字体 |
| ThemeSelector.vue | 纸张主题选择 | 当前主题 |
| ActionButtons.vue | 全屏、保存、导出等操作 | 无 |
| WritingArea.vue | 核心写作区域 | 文本内容 |
| PaperBackground.vue | 稿纸背景渲染 | 主题配置 |
| Editor.vue | 文本编辑核心 | 文本内容、光标位置 |
| StatusBar.vue | 底部状态显示 | 字数、时长 |
| StatisticsPanel.vue | 写作统计展示 | 历史数据 |

### 3.3 状态管理设计

#### 3.3.1 全局状态
```typescript
interface AppState {
  // 主题配置
  theme: 'rice-paper' | 'antique-paper' | 'white-paper';
  // 字体配置
  fontStyle: 'kai' | 'xing' | 'li' | 'song';
  fontSize: number;
  // 布局配置
  lineHeight: number;
  paperWidth: number;
  // 编辑器状态
  content: string;
  cursorPosition: number;
  // 显示状态
  isFullscreen: boolean;
  showToolbar: boolean;
  showStatusBar: boolean;
  showStatistics: boolean;
  // 统计数据
  wordCount: number;
  writingTime: number; // 秒
  lastSaveTime: Date | null;
}
```

#### 3.3.2 本地存储结构
```typescript
interface StoredDocument {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
}

interface StoredSettings {
  theme: string;
  fontStyle: string;
  fontSize: number;
  lineHeight: number;
  paperWidth: number;
}
```

---

## 4. 交互流程

### 4.1 启动流程
```
用户打开页面
        │
        ▼
    加载本地存储
        │
        ▼
    恢复上次会话
        │
        ▼
    显示写作界面
        │
        ▼
    开始写作（自动聚焦编辑器）
```

### 4.2 主题切换流程
```
用户点击主题按钮
        │
        ▼
    显示主题选择菜单
        │
        ▼
    用户选择主题
        │
        ▼
    更新主题状态
        │
        ▼
    PaperBackground 重新渲染
        │
        ▼
    保存到本地存储
```

### 4.3 字体切换流程
```
用户点击字体按钮
        │
        ▼
    显示字体选择菜单
        │
        ▼
    用户选择字体风格
        │
        ▼
    更新字体状态
        │
        ▼
    Editor 应用新字体
        │
        ▼
    保存到本地存储
```

### 4.4 全屏模式流程
```
用户点击全屏按钮 / 按 Esc
        │
        ▼
    切换全屏状态
        │
        ▼
    隐藏/显示工具栏和状态栏
        │
        ▼
    更新 DOM 样式
        │
        ▼
    浏览器全屏 API（可选）
```

### 4.5 保存流程
```
用户输入内容
        │
        ▼
    检测内容变化
        │
        ▼
    延迟 2 秒自动保存
        │
        ▼
    保存到 LocalStorage
        │
        ▼
    更新保存时间戳
        │
        ▼
    显示保存提示
```

### 4.6 导出流程
```
用户点击导出按钮
        │
        ▼
    显示导出格式选择
        │
        ▼
    用户选择格式（TXT/MD）
        │
        ▼
    生成文件内容
        │
        ▼
    创建下载链接
        │
        ▼
    触发浏览器下载
```

---

## 5. 稿纸背景渲染设计

### 5.1 SVG 背景实现

#### 5.1.1 横线格稿纸
```svg
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="lined-paper" patternUnits="userSpaceOnUse" width="100%" height="48">
      <line x1="0" y1="48" x2="100%" y2="48" stroke="#D4C4A8" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#lined-paper)"/>
</svg>
```

#### 5.1.2 田字格稿纸
```svg
<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid-paper" patternUnits="userSpaceOnUse" width="48" height="48">
      <line x1="0" y1="0" x2="48" y2="0" stroke="#E0D4BC" stroke-width="0.5"/>
      <line x1="0" y1="0" x2="0" y2="48" stroke="#E0D4BC" stroke-width="0.5"/>
      <line x1="24" y1="0" x2="24" y2="48" stroke="#D4C4A8" stroke-width="1"/>
      <line x1="0" y1="24" x2="48" y2="24" stroke="#D4C4A8" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid-paper)"/>
</svg>
```

#### 5.1.3 纸张纹理叠加
```css
.paper-texture {
  background-image: url('data:image/svg+xml;base64,...');
  opacity: 0.03;
  pointer-events: none;
}
```

### 5.2 Canvas 动态渲染（备选方案）
- 使用 Canvas API 绘制稿纸网格
- 支持动态调整行间距和列间距
- 性能优于 SVG 对于复杂图案

---

## 6. 编辑器设计

### 6.1 编辑器核心功能
- 使用 `contenteditable` 属性实现富文本编辑
- 自定义光标样式，模拟手写笔效果
- 支持文本选择、复制、粘贴
- 支持撤销/重做操作

### 6.2 光标设计
```css
.editor-cursor {
  caret-color: #8B7355;
  caret-shape: bar;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
```

### 6.3 输入处理
- 监听 `input` 事件实时更新字数统计
- 监听 `keydown` 事件处理快捷键
- 防抖处理自动保存

---

## 7. 响应式设计

### 7.1 断点配置
| 设备类型 | 屏幕宽度 | 布局调整 |
|---------|---------|---------|
| 手机 | < 768px | 单列布局，简化工具栏 |
| 平板 | 768px - 1024px | 标准布局，可折叠工具栏 |
| 桌面 | > 1024px | 完整布局，固定工具栏 |

### 7.2 移动端适配
- 触摸友好的按钮尺寸（最小 44px）
- 滑动手势支持
- 虚拟键盘适配

---

## 8. 图标设计

使用 Lucide Icons 图标库，统一图标风格：
- 简洁线性风格
- 24px 标准尺寸
- 与整体设计协调的颜色

| 功能 | 图标名称 |
|-----|---------|
| 保存 | save |
| 导出 | download |
| 全屏 | maximize |
| 退出全屏 | minimize |
| 字体 | type |
| 主题 | palette |
| 统计 | bar-chart |
| 设置 | settings |
| 新建 | plus |
| 删除 | trash-2 |

---

## 9. 动画效果

### 9.1 过渡动画
- 主题切换：淡入淡出效果（300ms）
- 字体切换：平滑过渡（200ms）
- 全屏切换：缩放动画（400ms）
- 面板展开/收起：滑动动画（300ms）

### 9.2 微交互
- 按钮悬停：轻微放大效果
- 输入时：光标闪烁动画
- 保存成功：短暂的对勾提示

---

## 10. 代码结构

```
src/
├── components/
│   ├── Toolbar/
│   │   ├── index.vue
│   │   ├── FontSelector.vue
│   │   ├── ThemeSelector.vue
│   │   └── ActionButtons.vue
│   ├── WritingArea/
│   │   ├── index.vue
│   │   ├── PaperBackground.vue
│   │   └── Editor.vue
│   ├── StatusBar/
│   │   ├── index.vue
│   │   ├── WordCounter.vue
│   │   ├── Timer.vue
│   │   └── Clock.vue
│   └── StatisticsPanel.vue
├── composables/
│   ├── useTheme.ts
│   ├── useFont.ts
│   ├── useEditor.ts
│   └── useStorage.ts
├── types/
│   └── index.ts
├── utils/
│   ├── storage.ts
│   └── helpers.ts
├── assets/
│   └── fonts/
├── App.vue
├── main.ts
└── style.css
```

---

## 11. API 设计

### 11.1 存储 API
```typescript
interface StorageAPI {
  saveDocument(doc: StoredDocument): void;
  loadDocument(id: string): StoredDocument | null;
  deleteDocument(id: string): void;
  getAllDocuments(): StoredDocument[];
  saveSettings(settings: StoredSettings): void;
  loadSettings(): StoredSettings;
}
```

### 11.2 编辑器 API
```typescript
interface EditorAPI {
  getContent(): string;
  setContent(content: string): void;
  getWordCount(): number;
  getCursorPosition(): number;
  setCursorPosition(pos: number): void;
  focus(): void;
  blur(): void;
}
```

---

## 12. 性能优化策略

### 12.1 渲染优化
- 使用 CSS 动画替代 JavaScript 动画
- 虚拟滚动（对于长文档）
- SVG 背景使用 pattern 复用

### 12.2 存储优化
- 防抖自动保存（2秒延迟）
- 压缩存储数据
- 定期清理旧版本数据

### 12.3 字体加载优化
- 字体预加载
- 渐进式字体渲染
- 回退字体链