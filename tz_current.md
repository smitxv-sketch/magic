# AI-Оркестратор СЭД — Актуальная Техническая Документация (v2.0)

> **Статус:** Актуализировано на основе текущего кода (28.02.2026).
> **Назначение:** Единый источник правды (SSOT) для разработки и поддержки.

---

## РАЗДЕЛ 1: КОНТЕКСТ ПРОДУКТА

### Что это такое
Платформа — «интеллектуальный экзоскелет» для 1С:Документооборот (1С:ДО) и Битрикс24. Она надстраивается над СЭД как внешний микросервис, обеспечивая автоматический контроль рисков и маршрутизацию документов с помощью LLM.

### Ключевые модули
1.  **Студия (Studio):** Рабочее место технолога/владельца процесса. Настройка промптов, загрузка регламентов, тестирование гипотез.
2.  **Плеер (Player):** Визуализация процесса для демонстрации стейкхолдерам. Анимация прохождения документа по маршруту.
3.  **Презентация (Presentation):** Динамический движок для питчинга Кайдзен-инициативы (JSON-driven).
4.  **IT Hub:** Техническая документация для интеграторов 1С/Bitrix24.
5.  **Библиотека действий (Action Library):** Витрина доступных AI-экшенов.
6.  **Кейсы (Cases):** Каталог готовых сценариев использования.

---

## РАЗДЕЛ 2: ТЕХНОЛОГИЧЕСКИЙ СТЕК

```
Frontend:     React 18 + Vite
Language:     TypeScript (strict: true)
Styling:      Tailwind CSS v3 + Framer Motion (анимации)
State:        Zustand (глобальный стор)
Validation:   Zod (схемы данных)
UI Patterns:  Bento Grid, Glassmorphism
Icons:        Lucide React
Data:         JSON-driven architecture (для презентаций и сценариев)
```

---

## РАЗДЕЛ 3: АРХИТЕКТУРА И СТРУКТУРА

### Файловая структура
```
/src
├── components/
│   ├── Layout/           # AppShell, SettingsModal
│   ├── Player/           # ProcessMap, Controls, ResultModal, ActiveStepInfo
│   ├── Studio/           # Bento-панели (Context, AI Config, Rules), LiveTestPanel
│   ├── presentation/     # PresentationView (движок презентации)
│   └── ui/               # Базовые UI-компоненты (Button, etc.)
├── data/
│   └── presentation_content.json  # Контент для презентации
├── hooks/                # usePlayerEngine, useLLMInference, useScenarioLoader
├── schemas/              # Zod-схемы (scenarioConfig, llmResponse)
├── store/                # appStore.ts (Zustand)
├── types/                # TypeScript интерфейсы (presentation.ts)
├── utils/                # cn, promptCompiler
└── views/                # Страницы верхнего уровня
    ├── ActionsView.tsx
    ├── CasesView.tsx
    └── ITHubView.tsx
```

---

## РАЗДЕЛ 4: ГЛОБАЛЬНЫЙ СТЕЙТ (Zustand)

Актуальный интерфейс `AppState` (`src/store/appStore.ts`):

```typescript
interface AppState {
  // === РЕЖИМ ПРИЛОЖЕНИЯ ===
  activeMode: 'studio' | 'player' | 'action-library' | 'it-hub' | 'cases' | 'presentation';
  setActiveMode: (mode: AppState['activeMode']) => void;

  // === НАСТРОЙКИ ===
  geminiApiKey: string | null;
  isSettingsOpen: boolean;
  isPlayerOpen: boolean; // Глобальное управление модалкой плеера

  // === СТУДИЯ ===
  activeCubeId: string | null;
  activeCube: {
    id: string;
    title: string;
    scenarioName?: string;
    prompt: string;
    knowledgeBase: string | null;
    placeholders: Placeholder[];
    inputArtifacts: Placeholder[];
    rules: ActionRule[];
    selectedProvider: LLMProvider;
    boolean_checks_config: BooleanCheck[];
  };

  // === ПЛЕЕР ===
  playerState: PlayerState;
  currentScenario: Scenario | null;
  artifacts: Record<string, string>;
  currentNodeIndex: number;
  lastLLMResult: LLMResponse | null;

  // === LIVE TEST ===
  testDocument: {
    fileName: string | null;
    extractedText: string | null;
    isLoading: boolean;
    result: LLMResponse | null;
  };
}
```

---

## РАЗДЕЛ 5: UI/UX СПЕЦИФИКАЦИЯ

### 1. AppShell (Навигация)
*   **Стиль:** Glassmorphism (`bg-white/70 backdrop-blur-xl`).
*   **Навигация:** Вкладки "Главная" (Презентация), "Студия", "Действия", "Кейсы".
*   **Тулбар:** Кнопки "Для ИТ", "Презентация" (быстрый переход), Настройки (шестеренка).
*   **Player Modal:** Глобальное модальное окно, доступное из любого места приложения.

### 2. Студия (StudioWorkspace)
*   **Лейаут:** Bento Grid (3 колонки).
    *   **Колонка 1 (Context):** Входящие данные и артефакты.
    *   **Колонка 2 (AI Config):** Промпт, База знаний (Drag & Drop), Выбор провайдера.
    *   **Колонка 3 (Rules):** Правила реакции и кнопка "Протестировать".
*   **Стиль:** Плавающие карточки с мягкими тенями и размытием фона.
*   **LiveTestPanel:** Выезжающая панель (Drawer) справа для тестирования на реальных файлах.

### 3. Плеер (PlayerWorkspace)
*   **ProcessMap:** Визуализация маршрута с анимированным маркером документа (Framer Motion).
    *   Использует `useRef` и `offsetLeft` для точного позиционирования маркера.
    *   Узлы: Стандартные (серые) и AI (цветные, пульсирующие).
*   **ActiveStepInfo:** Всплывающая карточка с информацией о текущем шаге (внизу экрана).
*   **ResultModal:** Модальное окно с результатами проверки LLM (Score, Findings, Action).
*   **Controls:** Плавающая панель управления (Play, Pause, Reset).

### 4. Презентация (PresentationView)
*   **Движок:** Рендерит контент на основе `src/data/presentation_content.json`.
*   **Типы блоков:**
    *   `hero`: Главный экран.
    *   `split-right` / `split-left`: Текст + Картинка.
    *   `bento`: Сетка метрик (ROI).
    *   `it-summary`: Технический слайд.
    *   `vision`: Слайд о будущем (Агенты).
    *   `cta`: Призыв к действию.
*   **Интеграция:** Кнопки в презентации могут переключать режимы приложения (например, открывать Плеер или Студию).

### 5. IT Hub (ITHubView)
*   **Контент:** Техническая документация для интеграторов.
*   **Элементы:** Примеры JSON-пейлоадов, описание API, архитектурные схемы.

---

## РАЗДЕЛ 6: ДАННЫЕ И СХЕМЫ

### Presentation Data (`src/types/presentation.ts`)
```typescript
export interface PresentationBlock {
  id: string;
  layout: BlockLayoutType;
  title: string;
  subtitle?: string;
  content?: ContentItem[];
  imageUrl?: string;
  metrics?: MetricItem[];
  primaryAction?: { label: string; actionId: string };
}
```

### Scenario Config (`src/schemas/scenarioConfig.ts`)
Описывает структуру сценария (узлы, промпты, задержки). Используется Zod для валидации.

### LLM Response (`src/schemas/llmResponse.ts`)
Описывает формат ответа от AI (status, analysis, execution_command).

---

## РАЗДЕЛ 7: ДИЗАЙН-СИСТЕМА (Tailwind)

*   **Цвета:** Семантические имена (`surface`, `primary`, `status-success`, `ai-node-glow`).
*   **Тени:** Мягкие, цветные тени (`shadow-glass`, `shadow-card-hover`).
*   **Анимации:** `pulse-slow`, `scan`.
*   **Утилиты:** `scrollbar-hide` (скрытие скроллбара).

---

## РАЗДЕЛ 8: ПЛАН РАЗВИТИЯ (TODO)

1.  **Загрузка изображений:** Добавить реальные изображения в `/public/images/` для презентации.
2.  **Интеграция с реальным API:** Заменить моки в `useLLMInference` на реальные вызовы (если требуется для демо).
3.  **Мобильная адаптация:** Проверить Bento Grid на мобильных устройствах.
