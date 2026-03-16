

### Шаг 2: Студийное ТЗ на Главный экран (Уровень Apple / Студии Лебедева)

Чтобы это выглядело дорого, мы уходим от банального «текст слева, картинка справа». Мы будем использовать паттерн **Bento Grid (Сетка Бенто)** и **Асимметричный скролл** с эффектом левитации (через Framer Motion).

Скопируй ТЗ ниже и отдай в Google AI Studio. В нем прописаны конкретные Tailwind-классы и физика анимаций, чтобы нейросеть сгенерировала не просто верстку, а премиальный дизайн-продукт.

---

# PATCH-ОБНОВЛЕНИЕ ТЗ: Премиальная верстка PresentationView.tsx

> **ИНСТРУКЦИЯ ДЛЯ AI-АГЕНТА:** Сверстать компонент `PresentationView.tsx` уровня топовых продуктовых презентаций (Apple, Stripe). Использовать Tailwind CSS для сетки и типографики, и `framer-motion` для появления элементов при скролле. Изображения берутся из локальной директории `/images/`.

## 1. Архитектура страницы и Дизайн-система

* **Контейнер:** Максимальная ширина `max-w-7xl`, центрирование `mx-auto`, большие отступы `px-8 py-24`. Обилие "воздуха" (White space) — критическое требование.
* **Типографика:** Заголовки (H1, H2) используют `tracking-tight` (уменьшенный межбуквенный интервал) для монолитности. Цвет заголовков — `text-slate-900`.
* **Анимация появления (Framer Motion):** Все блоки оборачиваются в `<motion.div>` с параметрами `initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}`. Это создаст эффект плавного всплытия при скролле.

## 2. Структура секций

### Секция 1: Hero (Главный экран) - Центральная композиция

* **Лейаут:** Вертикальный, выравнивание по центру (`flex flex-col items-center text-center`).
* **Текст:** * H1: "Интеллектуальный экзоскелет для вашей СЭД" (`text-5xl md:text-7xl font-extrabold mb-6`).
* Lead: "Автоматический контроль рисков и маршрутизация документов на базе AI. Без замены 1С:Документооборот." (`text-xl text-slate-500 max-w-2xl mb-10`).


* **Кнопки:** Группа кнопок (Primary "Смотреть демо" и Secondary "Архитектура").
* **Изображение:** `<img src="/images/hero-ai-core.png" />`.
* *Стилинг картинки:* Обернуть в `div` с классами `w-full max-w-5xl mt-16 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 relative`. Изображение должно "левитировать".



### Секция 2: Проблема (Хаос) - Асимметричный Split-View

* **Лейаут:** Сетка `grid grid-cols-1 lg:grid-cols-12 gap-16 items-center my-40`.
* **Текст (СЛЕВА, занимает 5 колонок `lg:col-span-5`):**
* H2: "Когда ручной контроль становится тормозом" (`text-4xl font-bold mb-6`).
* Параграфы с описанием боли (юристы тратят 40% времени, человеческий фактор, кабальные пени). Использовать маркеры в виде красных точек.


* **Изображение (СПРАВА, занимает 7 колонок `lg:col-span-7`):**
* `<img src="/images/problem-chaos.png" />`
* *Стилинг:* `rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-500`.



### Секция 3: Решение (Маршрутизация) - Реверсивный Split-View

* **Лейаут:** Сетка `grid grid-cols-1 lg:grid-cols-12 gap-16 items-center my-40`.
* **Изображение (СЛЕВА, занимает 7 колонок `lg:col-span-7 lg:order-1`):**
* `<img src="/images/solution-routing.png" />`
* Добавить легкое свечение сзади картинки через псевдоэлемент или градиентный blur (`bg-primary/10 blur-3xl absolute`).


* **Текст (СПРАВА, занимает 5 колонок `lg:col-span-5 lg:order-2`):**
* H2: "Превращаем хаос в управляемый поток" (`text-4xl font-bold mb-6`).
* Список фичей: Зеленый поток (Автоматика), Желтый поток (Экспертиза), Красный поток (Возврат).



### Секция 4: Bento Box (Результат и Безопасность)

* Вместо простого текста с картинкой используем модную "Bento" сетку.
* **Лейаут:** `grid grid-cols-1 md:grid-cols-3 gap-6 my-40`.
* **Большая карточка (занимает 2 колонки `md:col-span-2`):**
* Фон `bg-slate-50`, рамка `border border-slate-100`, `rounded-3xl p-8 overflow-hidden relative`.
* Заголовок: "Zero Errors и абсолютная прозрачность".
* Картинка `<img src="/images/result-security.png" />` позиционируется абсолютно в правом нижнем углу карточки, немного выходя за края, создавая 3D-эффект.


* **Малая карточка 1 (1 колонка):**
* Статистика: Крупная цифра "10x" и подпись "Ускорение согласования типовых документов".


* **Малая карточка 2 (1 колонка, под первой):**
* Статистика: Крупно "0%" и подпись "Пропущенных штрафных санкций благодаря AI-радару".



### Секция 5: Интеграция Модуля Сценариев (ActionsView)

* В самом низу страницы (сразу после секции Bento) рендерится уже готовый компонент `ActionsView.tsx`.
* Обернуть его в отдельный полноэкранный блок: `<div className="w-full bg-slate-50 py-24 border-t border-slate-200"><div className="max-w-7xl mx-auto..."> <ActionsView /> </div></div>`.

## 3. Требования к качеству кода

* Избегать жестко заданных высот (`h-px`). Использовать `aspect-ratio` для изображений, чтобы страница не прыгала при загрузке.
* Все изображения должны иметь атрибут `alt` для семантики.
* Обеспечить безупречный респонсив: на мобильных экранах (`md` и ниже) все `grid-cols-12` схлопываются в одну колонку, картинки всегда идут *под* текстом, отступы уменьшаются до `py-12`.


---

```markdown
# PATCH-ОБНОВЛЕНИЕ ТЗ: Премиальный UI-Polish (Bento Grid & Glassmorphism)

> **ИНСТРУКЦИЯ ДЛЯ AI-АГЕНТА:** Этот патч обновляет визуальный стиль основных рабочих экранов (Студия и Плеер). Логика компонентов и Zustand-store остаются без изменений. Задача — применить консистентный дизайн-язык "Bento Grid" (модульная сетка плавающих карточек) ко всему приложению.

## 1. Общий фон приложения (AppShell.tsx)
Уходим от сплошного серого фона к сложному, глубокому фону, на котором будет "играть" стекло.
- Добавить в корневой `div` приложения класс: `bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-background to-slate-200 min-h-screen`.
- Убедиться, что навигационная панель (Navbar) имеет свойства стекла: `sticky top-4 mx-4 z-50 bg-white/70 backdrop-blur-xl border border-white/40 shadow-sm rounded-2xl`.

## 2. Редизайн «Студии» (StudioWorkspace.tsx) в стиле Bento
Три колонки Студии должны выглядеть не как скучные таблицы, а как парящие Bento-боксы.
- **Контейнер Студии:** `grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto`.
- **Общий стиль для каждой колонки (Панели):**
  Каждая из трех колонок (`InputContextPanel`, `AIConfigPanel`, `OutputRulesPanel`) должна быть обернута в единый класс:
  `bg-white/60 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]`.
- **Внутренние элементы (текстовые поля, drag-n-drop):**
  Вместо жестких рамок использовать заливку `bg-white/80 rounded-2xl border-0 ring-1 ring-slate-900/5 focus-within:ring-2 focus-within:ring-primary/50 shadow-inner`.

## 3. Редизайн «Плеера» (PlayerWorkspace.tsx & ProcessMap.tsx)
Плеер должен выглядеть как футуристичный дашборд.
- **Панель управления (PlayerControls):** Оформить в виде плавающей "пилюли" внизу экрана (в стиле Dynamic Island). 
  Классы: `fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl text-white px-8 py-4 rounded-full shadow-2xl border border-white/10 flex items-center gap-6 z-50`.
- **Карточки узлов (ProcessNode.tsx):**
  - Обычный узел: `bg-white/80 backdrop-blur-md border border-slate-200/50 rounded-2xl shadow-sm p-5`.
  - AI-узел (Активный): Добавить пульсирующее свечение через `ring-4 ring-primary/20 shadow-[0_0_40px_theme(colors.primary/30)] bg-gradient-to-b from-white to-primary-light/30 border-primary/50`.
- **Модальное окно результата (ResultModal.tsx):** Максимальный Glassmorphism. `bg-white/85 backdrop-blur-3xl border border-white/60 shadow-modal rounded-[2rem] overflow-hidden`.

## 4. Микроинтеракции (Framer Motion)
- При открытии Студии колонки должны появляться не одновременно, а каскадом (Stagger effect). Левая колонка появляется первой, затем центральная, затем правая (задержка `delay: 0.1` между ними).
- Все кнопки при наведении (`hover`) должны иметь легкий `scale-105` и эффект пружины (spring).

```
