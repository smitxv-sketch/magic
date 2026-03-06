export type BlockLayoutType = 
  | 'hero' 
  | 'split-right' // Картинка справа, текст слева
  | 'split-left'  // Картинка слева, текст справа
  | 'bento'       // Сетка карточек с метриками
  | 'it-summary'  // Блок ИТ-архитектуры
  | 'vision'      // Блок будущего (Агенты)
  | 'cta';        // Призыв к действию (Пилот)

export interface ContentItem {
  icon?: string; // Название иконки из lucide-react (например, 'FileText', 'Shield')
  title?: string;
  text: string;
}

export interface MetricItem {
  value: string;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface PresentationBlock {
  id: string;
  layout: BlockLayoutType;
  badge?: string; // Маленький лейбл над заголовком (например, "Кайдзен-инициатива")
  title: string;
  subtitle?: string;
  content?: ContentItem[]; 
  imageUrl?: string; // Путь к локальной картинке, например "/images/hero.png"
  metrics?: MetricItem[];
  primaryAction?: { label: string; actionId: string }; // actionId для обработки кликов (например, 'open-player')
}

export interface PresentationData {
  meta: {
    company: string;
    department: string;
    version: string;
  };
  blocks: PresentationBlock[];
}
